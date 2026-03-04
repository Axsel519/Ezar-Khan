/** @format */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productsAPI, commentsAPI } from "../services/api";
import "../style.css";

export default function ProductDetails({
  onAdd,
  getProductQuantity,
  showToast,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for product
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ⭐️ متغيرات التقييم والتعليقات ⭐️

  // show product id for clarity (prefer customId, then numericId)
  const displayId =
    product && product.customId ? product.customId
    : product && product.numericId != null ? product.numericId
    : product ? product.id || product._id
    : id;
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [userReviews, setUserReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(4.7);
  const [totalReviews, setTotalReviews] = useState(120);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comments, setComments] = useState([]);

  // ⭐️ استخدام getProductQuantity للحصول على الكمية الحالية ⭐️
  const currentQuantity = getProductQuantity ? getProductQuantity(id) : 0;

  const [quantity, setQuantity] = useState(currentQuantity);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [zoomImage, setZoomImage] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch product from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getById(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch comments from backend
  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;
      try {
        const data = await commentsAPI.getByProduct(id);
        setComments(data || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchComments();
  }, [id]);

  // ✅ دالة التعامل مع الإعجاب بالتعليق
  const handleLikeComment = (commentId) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: (comment.likes || 0) + 1,
          };
        }
        return comment;
      }),
    );

    showToast && showToast("تم تسجيل إعجابك بالتعليق", "success");
  };

  // ✅ دالة إضافة تعليق جديد
  const handleAddComment = async () => {
    const commentText = document.getElementById("commentText")?.value;
    const userName =
      document.getElementById("commentUserName")?.value || "مجهول";

    if (commentText) {
      try {
        const newComment = await commentsAPI.create({
          productId: id,
          text: commentText,
          rating: rating || 5,
        });

        setComments([newComment, ...comments]);

        // مسح الحقول
        if (document.getElementById("commentText")) {
          document.getElementById("commentText").value = "";
        }
        if (document.getElementById("commentUserName")) {
          document.getElementById("commentUserName").value = "";
        }

        setShowCommentForm(false);
        showToast && showToast("تم إضافة التعليق بنجاح", "success");
      } catch (error) {
        console.error("Error adding comment:", error);
        showToast && showToast("فشل في إضافة التعليق", "error");
      }
    } else {
      showToast && showToast("الرجاء كتابة تعليق", "warning");
    }
  };

  // تحديث الكمية عند تغيير المنتج أو الكمية في السلة
  useEffect(() => {
    setQuantity(getProductQuantity ? getProductQuantity(id) : 0);
  }, [id, getProductQuantity]);

  // التحقق من المفضلة في localStorage
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(id));
  }, [id]);

  // التمرير إلى الأعلى عند تغيير المنتج
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // إعادة تعيين حالة التقييم عند تغيير المنتج
    setRating(0);
    setHoverRating(0);
    setShowReviewForm(false);
    setShowCommentForm(false);
    setActiveIndex(0);
    setZoomImage(false);
  }, [id]);

  // تحديث المنتجات المقترحة عند تغيير المنتج
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product || !product.category) return;

      try {
        setLoadingRelated(true);
        // Fetch all products and filter by category
        const data = await productsAPI.getAll();

        let productsArray = [];
        if (Array.isArray(data)) {
          productsArray = data;
        } else if (data && Array.isArray(data.products)) {
          productsArray = data.products;
        } else if (data && Array.isArray(data.data)) {
          productsArray = data.data;
        }

        // Filter products from same category (excluding current product)
        const currentProductId =
          product.customId ||
          (product.numericId != null ?
            product.numericId
          : product.id || product._id);
        const related = productsArray.filter((p) => {
          const pId =
            p.customId || (p.numericId != null ? p.numericId : p.id || p._id);
          return p.category === product.category && pId !== currentProductId;
        });

        setRelatedProducts(related.slice(0, 4)); // Limit to 4 related products
      } catch (error) {
        console.error("Error fetching related products:", error);
        setRelatedProducts([]);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  // ✅ دالة لتحميل بيانات التقييمات والمراجعات للمنتج الحالي
  const loadProductReviews = () => {
    // تحميل تقييم المستخدم لهذا المنتج
    const ratings = JSON.parse(localStorage.getItem("productRatings") || "{}");
    const currentRating = ratings[id] || 0;
    setRating(currentRating);

    // تحميل التقييمات المحفوظة
    const savedReviews = JSON.parse(
      localStorage.getItem("productReviews") || "{}",
    );
    const currentReviews = savedReviews[id] || [];
    setUserReviews(currentReviews);

    // حساب التقييم المتوسط من التقييمات المحفوظة
    if (currentReviews.length > 0) {
      const total = currentReviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      );
      const avg = total / currentReviews.length;
      setAverageRating(parseFloat(avg.toFixed(1)));
      setTotalReviews(currentReviews.length);
    } else {
      // إذا لم تكن هناك مراجعات، استخدم القيم الافتراضية
      setAverageRating(4.7);
      setTotalReviews(120);
    }

    // تحميل التعليقات المحفوظة
    const savedComments = JSON.parse(
      localStorage.getItem("productComments") || "{}",
    );
    setComments(savedComments[id] || []);
  };

  // ✅ تحميل بيانات التقييمات والمراجعات عند تغيير المنتج
  useEffect(() => {
    if (id) {
      loadProductReviews();
    }
  }, [id]); // ✅ تم إضافة id كاعتماد

  // ✅ إعادة تحميل التقييمات عند تغيير المنتج
  useEffect(() => {
    const handleBeforeUnload = () => {
      // إعادة تحميل التقييمات عند العودة إلى الصفحة
      if (product) {
        loadProductReviews();
      }
    };

    // إضافة مستمع لحدث تغيير الـ URL
    window.addEventListener("popstate", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handleBeforeUnload);
    };
  }, [id, product]);

  // حفظ التعليقات عند التغيير
  useEffect(() => {
    const commentsData = JSON.parse(
      localStorage.getItem("productComments") || "{}",
    );
    commentsData[id] = comments;
    localStorage.setItem("productComments", JSON.stringify(commentsData));
  }, [comments, id]);

  // تقييم المنتج
  const handleRating = (rate) => {
    setRating(rate);

    // حفظ التقييم في localStorage
    const ratings = JSON.parse(localStorage.getItem("productRatings") || "{}");
    ratings[id] = rate;
    localStorage.setItem("productRatings", JSON.stringify(ratings));

    showToast && showToast(`شكراً لتقييمك! ${rate} نجوم`, "success");

    // إذا كان هناك تقييم نصي، لا نحتاج لتحديث المتوسط
    if (!showReviewForm) {
      updateAverageRating(rate);
    }
  };

  // تحديث التقييم المتوسط
  const updateAverageRating = (newRating) => {
    const newTotalReviews = totalReviews + 1;
    const newAverage =
      (averageRating * totalReviews + newRating) / newTotalReviews;
    setAverageRating(parseFloat(newAverage.toFixed(1)));
    setTotalReviews(newTotalReviews);
  };

  // إضافة تقييم نصي
  const handleAddReview = () => {
    const reviewText = document.getElementById("reviewText")?.value;
    const userName = document.getElementById("userName")?.value || "مستخدم";

    if (reviewText && rating > 0) {
      const newReview = {
        id: Date.now(),
        userName,
        rating,
        comment: reviewText,
        date: new Date().toLocaleDateString("ar-SA"),
        verified: false,
      };

      const updatedReviews = [newReview, ...userReviews];
      setUserReviews(updatedReviews);

      // حفظ التقييمات في localStorage
      const reviews = JSON.parse(
        localStorage.getItem("productReviews") || "{}",
      );
      reviews[id] = updatedReviews;
      localStorage.setItem("productReviews", JSON.stringify(reviews));

      // مسح الحقول
      if (document.getElementById("reviewText")) {
        document.getElementById("reviewText").value = "";
      }
      if (document.getElementById("userName")) {
        document.getElementById("userName").value = "";
      }
      setRating(0);
      setShowReviewForm(false);

      // تحديث التقييم المتوسط
      updateAverageRating(rating);

      showToast &&
        showToast("شكراً لتقييمك! تم إضافة التقييم بنجاح", "success");
    } else {
      showToast && showToast("الرجاء إدخال تقييم ونص التقييم", "warning");
    }
  };

  // دالة لفحص الصور
  const checkImage = (src) => {
    const img = new Image();
    img.onload = () => console.log(`✅ الصورة موجودة: ${src}`);
    img.onerror = () => console.error(`❌ الصورة غير موجودة: ${src}`);
    img.src = src;
  };

  // فحص الصور عند تحميل المكون
  useEffect(() => {
    if (product?.images) {
      console.log("🔍 فحص الصور للمنتج:", product.title);
      product.images.forEach(checkImage);
    }
  }, [product]);

  const handleFavoriteToggle = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (isFavorite) {
      // إزالة من المفضلة
      const newFavorites = favorites.filter((favId) => favId !== id);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      setIsFavorite(false);
      showToast && showToast("تمت الإزالة من المفضلة", "info");
    } else {
      // إضافة إلى المفضلة
      favorites.push(id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
      showToast && showToast("تمت الإضافة إلى المفضلة", "success");
    }
  };

  const handleImageZoom = (e) => {
    if (!zoomImage) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleRelatedProductClick = (product) => {
    // choose id for URL: customId first, then numericId, then mongo id
    const productId =
      product.customId ||
      (product.numericId != null ?
        product.numericId
      : product.id || product._id);
    console.log("🎯 النقر على المنتج:", productId);
    console.log("📍 المنتج الحالي:", id);
    console.log("📍 المنتج الجديد:", productId);

    if (String(productId) === String(id)) {
      console.log("⚠️ نفس المنتج!");
      showToast && showToast("أنت بالفعل في صفحة هذا المنتج!", "info");
      return;
    }

    if (loadingRelated) return;

    setLoadingRelated(true);

    // ✅ إعادة تعيين حالة التقييم قبل الانتقال
    setRating(0);
    setHoverRating(0);
    setShowReviewForm(false);
    setShowCommentForm(false);
    setActiveIndex(0);
    setZoomImage(false);

    // الانتقال إلى المنتج الجديد
    setTimeout(() => {
      console.log("🚀 الانتقال إلى:", `/product/${productId}`);
      navigate(`/product/${productId}`);
      window.scrollTo({ top: 0, behavior: "smooth" });

      // ✅ إعادة تعيين حالة التحميل بعد الانتقال
      setTimeout(() => {
        setLoadingRelated(false);
      }, 300);
    }, 200);
  };

  // للتصحيح: إضافة console.log للتحقق من البيانات
  useEffect(() => {
    console.log("🔎 المنتج الحالي (id):", id);
    console.log("📦 المنتج الموجود:", product);
    console.log("🔄 المنتجات المقترحة:", relatedProducts);
    console.log("⭐️ التقييم الحالي للمنتج:", rating);
    console.log("📝 المراجعات الحالية:", userReviews.length);
  }, [id, product, relatedProducts, rating, userReviews]);

  if (!product) {
    console.log("❌ المنتج غير موجود! id:", id);
    return (
      <div className="container py-5 text-center" style={{ minHeight: "70vh" }}>
        <div className="error-container">
          <i className="bi bi-exclamation-triangle-fill text-warning fs-1 mb-4"></i>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            المنتج غير موجود
          </h1>
          <p className="text-muted mb-4">
            عذراً، المنتج الذي تبحث عنه غير متوفر حالياً.
            <br />
            <small>ID: {id}</small>
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button
              onClick={() => navigate("/shop")}
              className="btn btn-primary px-4"
            >
              <i className="bi bi-arrow-right ml-2"></i>
              العودة للمتجر
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images = product?.images || [];

  // render header id line
  const idLine =
    product ?
      <small className="text-muted">
        ID:{" "}
        {product.customId ?
          product.customId + ` (${product.id || product._id})`
        : product.numericId != null ?
          product.numericId + ` (${product.id || product._id})`
        : product.id || product._id}
      </small>
    : null;

  const goToPrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  const increase = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onAdd(product, newQuantity);
    showToast && showToast(`تم زيادة الكمية إلى ${newQuantity}`, "info");
  };

  const decrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onAdd(product, newQuantity);
      showToast && showToast(`تم تقليل الكمية إلى ${newQuantity}`, "info");
    } else {
      setQuantity(0);
      onAdd(product, 0);
      showToast && showToast(`تم إزالة المنتج من السلة`, "warning");
    }
  };

  const handleAddToCart = () => {
    setLoading(true);
    setTimeout(() => {
      onAdd(product, 1);
      setQuantity(1);
      if (showToast)
        showToast(`تمت إضافة ${product.title} إلى السلة`, "success");
      setLoading(false);
    }, 300);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      navigate("/cart");
    }, 500);
  };

  return (
    <div className="container details-container" dir="rtl">
      {/* شريط التنقل */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/shop" className="text-decoration-none">
              العودة للمتجر
            </Link>
          </li>
        </ol>
      </nav>

      <div className="row g-5 align-items-start">
        {/* قسم الصور مع Carousel */}
        <div className="col-lg-6 d-flex justify-content-center">
          <div className="position-relative">
            {/* زر المفضلة */}
            <button
              onClick={handleFavoriteToggle}
              className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle shadow-sm d-flex align-items-center justify-content-center"
              style={{ zIndex: 20, width: "45px", height: "45px" }}
              title={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
            >
              {isFavorite ?
                /* ❤️ Heart Filled */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="text-danger"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                  />
                </svg>
              : /* 🤍 Heart Outline */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                </svg>
              }
            </button>

            {/* زر التكبير */}
            {images.length > 0 && (
              <button
                onClick={() => setZoomImage(!zoomImage)}
                className="btn btn-light position-absolute top-0 start-0 m-3 rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                style={{ zIndex: 20, width: "45px", height: "45px" }}
                title={zoomImage ? "إغلاق التكبير" : "تكبير الصورة"}
              >
                {zoomImage ?
                  /* 🔍 Zoom Out */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0"
                    />
                    <path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z" />
                    <path
                      fillRule="evenodd"
                      d="M3 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5"
                    />
                  </svg>
                : /* 🔍 Zoom In */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0"
                    />
                    <path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z" />
                    <path
                      fillRule="evenodd"
                      d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5"
                    />
                  </svg>
                }
              </button>
            )}

            {/* Carousel Container */}
            <div
              className={`shadow-lg rounded-3 bg-light overflow-hidden ${
                zoomImage ? "cursor-zoom" : ""
              }`}
              style={{
                width: "30vw",
                minWidth: "300px",
                maxWidth: "500px",
                height: "400px",
                position: "relative",
              }}
              onMouseMove={handleImageZoom}
              onMouseLeave={() => setZoomPosition({ x: 0, y: 0 })}
            >
              {/* رسالة لو مفيش صور */}
              {images.length === 0 ?
                <div className="h-100 d-flex flex-column justify-content-center align-items-center p-4 text-center">
                  <i className="bi bi-image text-muted fs-1 mb-3"></i>
                  <p className="text-muted">لا توجد صور لهذا المنتج</p>
                </div>
              : <>
                  {/* الصورة الرئيسية مع تأثير التكبير */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    {images.map((img, index) => (
                      <div
                        key={index}
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          padding: "1rem",
                          opacity: index === activeIndex ? 1 : 0,
                          zIndex: index === activeIndex ? 2 : 1,
                          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          transform:
                            zoomImage && index === activeIndex ?
                              "scale(2)"
                            : "scale(1)",
                          transition:
                            zoomImage ?
                              "transform 0.1s ease"
                            : "transform 0.3s ease, opacity 0.5s ease",
                        }}
                      >
                        <img
                          src={img}
                          className="w-100 h-100"
                          style={{
                            objectFit: "contain",
                            pointerEvents: "none",
                          }}
                          alt={`${product.title} - صورة ${index + 1}`}
                          loading="lazy"
                          onError={(e) => {
                            console.error(`❌ فشل تحميل الصورة: ${img}`);
                            e.target.onerror = null;
                            e.target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%236c757d' text-anchor='middle' dy='.3em'%3E" +
                              encodeURIComponent(product.title) +
                              "%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* أزرار التحكم */}
                  {images.length > 1 && (
                    <>
                      <button
                        className="carousel-control-prev position-absolute top-50 start-0 translate-middle-y"
                        type="button"
                        onClick={goToPrev}
                        style={{
                          width: "50px",
                          height: "60px",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          border: "none",
                          borderTopRightRadius: "8px",
                          borderBottomRightRadius: "8px",
                          zIndex: 10,
                        }}
                      >
                        <span
                          className="carousel-control-prev-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Previous</span>
                      </button>

                      <button
                        className="carousel-control-next position-absolute top-50 end-0 translate-middle-y"
                        type="button"
                        onClick={goToNext}
                        style={{
                          width: "50px",
                          height: "60px",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          border: "none",
                          borderTopLeftRadius: "8px",
                          borderBottomLeftRadius: "8px",
                          zIndex: 10,
                        }}
                      >
                        <span
                          className="carousel-control-next-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </>
                  )}
                </>
              }
            </div>

            {/* مؤشرات الصور والصور المصغرة */}
            {images.length > 1 && (
              <div className="mt-3 d-flex justify-content-center align-items-center">
                {/* الصور المصغرة */}
                <div className="d-flex justify-content-center gap-2 mt-2">
                  {images.slice(0, 4).map((img, index) => (
                    <button
                      key={index}
                      className={`border rounded p-1 ${
                        index === activeIndex ? "border-primary" : (
                          "border-light"
                        )
                      }`}
                      onClick={() => goToSlide(index)}
                      style={{
                        width: "60px",
                        height: "60px",
                        overflow: "hidden",
                        background: "white",
                      }}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-100 h-100 object-fit-cover"
                        style={{
                          opacity: index === activeIndex ? 1 : 0.7,
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* قسم تفاصيل المنتج */}
        <div className="col-lg-6">
          {/* العنوان والمعلومات */}
          <div className="d-flex justify-content-between align-items-start mb-3 info-detai">
            <div>
              <h1 className="product-title h2 mb-0" style={{ maxWidth: "80%" }}>
                {product.title}
              </h1>
              {/* display unique identifier */}
              {idLine}
            </div>
            {/* مشاركة المنتج */}
            <div className="dropdown">
              <button
                className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                type="button"
                style={{ width: "40px", height: "40px" }}
                title="مشاركة"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast && showToast("تم نسخ رابط الصفحة 📋", "success");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3" />
                </svg>
              </button>
            </div>
          </div>

          {/* التقييم والسعر */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="rating-section d-flex align-items-center evaluation">
              {/* ⭐️ نظام النجوم التفاعلي ⭐️ */}
              <div className="stars-icons d-flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="star-btn p-0 bg-transparent border-0"
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    title={`تقييم ${star} نجمة${star > 1 ? "ات" : ""}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      className={`bi bi-star${
                        star <= (hoverRating || rating) ? "-fill" : ""
                      } ${
                        star <= (hoverRating || rating) ?
                          "text-warning"
                        : "text-muted"
                      }`}
                      viewBox="0 0 16 16"
                    >
                      <path
                        d={
                          star <= (hoverRating || rating) ?
                            "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                          : "M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"
                        }
                      />
                    </svg>
                  </button>
                ))}
              </div>
              <span className="rating-count text-muted ms-2">
                {averageRating.toFixed(1)} ({totalReviews}) مراجعة
              </span>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-primary text-decoration-none ms-3 border-0 bg-transparent"
              >
                <i className="bi bi-chat-square-text me-1"></i>
                اكتب تقييماً
              </button>
            </div>

            <div className="align-items-center gap-2 code">
              <span className="text-muted small">الكود:</span>
              <span className="badge bg-light text-dark border">
                #
                {product.customId ?
                  product.customId
                : product.numericId != null ?
                  product.numericId
                : product.id || product._id}
              </span>
            </div>
          </div>

          {/* نموذج إضافة التقييم */}
          {showReviewForm && (
            <div className="review-form-section mb-4 p-4 bg-light rounded-3">
              <h5 className="mb-3">
                <i className="bi bi-pencil-square text-primary me-2"></i>
                اكتب تقييمك
              </h5>
              <div className="mb-3">
                <label className="form-label">اسمك (اختياري):</label>
                <input
                  type="text"
                  id="userName"
                  className="form-control"
                  placeholder="أدخل اسمك"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">التقييم:</label>
                <div className="d-flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="star-btn p-0 bg-transparent border-0 me-1"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        fill="currentColor"
                        className={`bi bi-star${
                          star <= (hoverRating || rating) ? "-fill" : ""
                        } ${
                          star <= (hoverRating || rating) ?
                            "text-warning"
                          : "text-muted"
                        }`}
                        viewBox="0 0 16 16"
                      >
                        <path
                          d={
                            star <= (hoverRating || rating) ?
                              "M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                            : "M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"
                          }
                        />
                      </svg>
                    </button>
                  ))}
                  <span className="ms-2 align-self-center">
                    {rating > 0 ?
                      `${rating} نجمة${rating > 1 ? "ات" : ""}`
                    : "اختر تقييم"}
                  </span>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">تعليقك:</label>
                <textarea
                  id="reviewText"
                  className="form-control"
                  rows="3"
                  placeholder="شاركنا تجربتك مع هذا المنتج..."
                ></textarea>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  onClick={handleAddReview}
                  disabled={rating === 0}
                >
                  <i className="bi bi-send me-2"></i>
                  إرسال التقييم
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowReviewForm(false)}
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}

          {/* السعر */}
          <div className="product-price-section mb-4 p-3 bg-light rounded-3">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h2 className="product-price-tag text-primary mb-0">
                  {product.price.toFixed(2)} جنيه
                </h2>
                {product.originalPrice && (
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <span className="text-decoration-line-through text-muted">
                      {product.originalPrice.toFixed(2)} جنيه
                    </span>
                    <span className="badge bg-danger">
                      {Math.round(
                        (1 - product.price / product.originalPrice) * 100,
                      )}
                      % خصم
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* الوصف */}
          <div className="mb-4">
            <h4 className="mb-3 d-flex align-items-center">
              <i className="bi bi-card-text text-primary me-2"></i>
              الوصف
            </h4>
            <div className="product-desc-text p-3 bg-light rounded-3">
              {product.description || "منتج عالي الجودة مع ضمان الرضا الكامل."}
            </div>
          </div>

          {/* المواصفات */}
          {product.specifications && (
            <div className="mb-4">
              <h4 className="mb-3 d-flex align-items-center">
                <i className="bi bi-list-check text-primary me-2"></i>
                المواصفات
              </h4>
              <div className="row">
                {Object.entries(product.specifications)
                  .slice(0, 4)
                  .map(([key, value], index) => (
                    <div key={index} className="col-md-6 mb-2">
                      <div className="d-flex justify-content-between border-bottom pb-1">
                        <span className="text-muted">{key}:</span>
                        <span className="fw-semibold">{value}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* أزرار التحكم في الكمية */}
          <div className="mb-5">
            {quantity === 0 ?
              <div className="d-flex flex-column flex-md-row gap-3">
                <button
                  className="btn btn-primary btn-lg py-3 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 flex-grow-1"
                  onClick={handleAddToCart}
                  disabled={loading || product.stock === 0}
                >
                  {loading ?
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                      ></span>
                      جاري الإضافة...
                    </>
                  : <>
                      <i className="bi bi-cart-plus fs-4"></i>
                      أضف إلى السلة
                    </>
                  }
                </button>

                <button
                  className="btn btn-success btn-lg py-3 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 flex-grow-1"
                  onClick={handleBuyNow}
                  disabled={loading || product.stock === 0}
                >
                  <i className="bi bi-lightning-fill"></i>
                  اشترِ الآن
                </button>
              </div>
            : <div className="cart-controls-wrapper custom-controls-style p-4 bg-light rounded-3">
                <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <h5 className="mb-0">الكمية:</h5>
                    <div className="d-flex align-items-center gap-3">
                      <button
                        className="btn btn-outline-primary rounded-circle p-0 d-flex align-items-center justify-content-center quantity-btn"
                        onClick={increase}
                        disabled={loading || product.stock <= quantity}
                        style={{ width: "44px", height: "44px" }}
                        title={
                          product.stock <= quantity ?
                            "تجاوزت الكمية المتاحة"
                          : ""
                        }
                      >
                        <i>+</i>
                      </button>

                      <div className="quantity-display bg-light rounded-3 shadow-sm px-4 py-2">
                        <span className="fs-3 fw-bold text-primary">
                          {quantity}
                        </span>
                      </div>

                      <button
                        className="btn btn-outline-primary rounded-circle p-0 d-flex align-items-center justify-content-center quantity-btn"
                        onClick={decrease}
                        disabled={loading || quantity === 0}
                        style={{ width: "44px", height: "44px" }}
                      >
                        <i>-</i>
                      </button>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => {
                        onAdd(product, 0);
                        setQuantity(0);
                        showToast &&
                          showToast("تم إزالة المنتج من السلة", "warning");
                      }}
                    >
                      <i className="bi bi-trash me-1"></i>
                      إزالة
                    </button>

                    <button
                      className="btn btn-success"
                      onClick={() => navigate("/cart")}
                    >
                      <i className="bi bi-cart-check me-1"></i>
                      اذهب للسلة
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <p className="text-muted mb-0">
                    الإجمالي:{" "}
                    <span className="fw-bold text-primary fs-4">
                      {(product.price * quantity).toFixed(2)} جنيه
                    </span>
                  </p>
                  {product.stock <= quantity && (
                    <p className="text-danger small mb-0 mt-2">
                      <i className="bi bi-exclamation-triangle me-1"></i>
                      الكمية المطلوبة تتجاوز المخزون المتاح
                    </p>
                  )}
                </div>
              </div>
            }
          </div>

          {/* المميزات */}
          <div className="features-container custom-features-style p-4 bg-light rounded-3">
            <h5 className="mb-4 d-flex align-items-center">
              <i className="bi bi-stars text-primary me-2"></i>
              مميزات المنتج:
            </h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="feature-row d-flex align-items-center p-3 bg-white rounded-3 shadow-sm h-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-wallet2"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" />
                  </svg>
                  <div className="ms-3">
                    <span className="feature-label fw-bold">
                      ضمان استرجاع الأموال
                    </span>
                    <p className="text-muted mb-0 small">14 يوم ضمان استرجاع</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="feature-row d-flex align-items-center p-3 bg-white rounded-3 shadow-sm h-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-truck"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                  <div className="ms-3">
                    <span className="feature-label fw-bold">شحن سريع وآمن</span>
                    <p className="text-muted mb-0 small">توصيل خلال 2-4 أيام</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="feature-row d-flex align-items-center p-3 bg-white rounded-3 shadow-sm h-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-person-workspace"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                    <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z" />
                  </svg>
                  <div className="ms-3">
                    <span className="feature-label fw-bold">
                      خدمة عملاء 24/7
                    </span>
                    <p className="text-muted mb-0 small">دعم فني متواصل</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="feature-row d-flex align-items-center p-3 bg-white rounded-3 shadow-sm h-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-credit-card-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0zm0 3v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7zm3 2h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1" />
                  </svg>
                  <div className="ms-3">
                    <span className="feature-label fw-bold">دفع آمن</span>
                    <p className="text-muted mb-0 small">مدفوعات مشفرة وآمنة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* قسم التعليقات - تم تحديثه */}
      <div className="mt-5" id="comments">
        <h3 className="mb-4 border-bottom pb-3">
          <i className="bi bi-chat-left-text text-primary me-2"></i>
          التعليقات ({comments.length})
        </h3>

        {/* نموذج إضافة تعليق */}
        {showCommentForm && (
          <div className="comment-form-section mb-4 p-4 bg-light rounded-3">
            <h5 className="mb-3">
              <i className="bi bi-chat-left-text text-primary me-2"></i>
              أضف تعليقاً
            </h5>
            <div className="mb-3">
              <label className="form-label">اسمك (اختياري):</label>
              <input
                type="text"
                id="commentUserName"
                className="form-control"
                placeholder="أدخل اسمك"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">تعليقك:</label>
              <textarea
                id="commentText"
                className="form-control"
                rows="3"
                placeholder="اكتب تعليقك هنا..."
              ></textarea>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" onClick={handleAddComment}>
                <i className="bi bi-send me-2"></i>
                إرسال التعليق
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowCommentForm(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        )}

        {comments.length > 0 ?
          <div className="comments-list">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="comment-item mb-4 p-4 bg-white border rounded-3 shadow-sm"
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center">
                    {/* أيقونة المستخدم (Avatar) */}
                    <div
                      className="rounded-circle bg-light border d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "45px",
                        height: "45px",
                        fontSize: "1.2rem",
                        color: "#555",
                      }}
                    >
                      {comment.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">{comment.userName}</h6>
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        {comment.date} {comment.time ? `- ${comment.time}` : ""}
                      </small>
                    </div>
                  </div>

                  {/* زر الإعجاب بالتعليق */}
                  <button
                    className="btn btn-sm btn-outline-light text-secondary border-0"
                    onClick={() => handleLikeComment(comment.id)}
                    title="أعجبني"
                  >
                    <i className="bi bi-hand-thumbs-up-fill text-primary me-1"></i>
                    <span className="text-dark">({comment.likes || 0})</span>
                  </button>
                </div>

                <p
                  className="mb-0 mt-2 text-dark"
                  style={{ lineHeight: "1.6" }}
                >
                  {comment.comment}
                </p>
              </div>
            ))}
          </div>
        : <div className="text-center py-5 bg-light rounded-3">
            <i className="bi bi-chat-square-dots fs-1 text-muted mb-3"></i>
            <p className="text-muted">
              لا توجد تعليقات بعد. كن أول من يشارك برأيه!
            </p>
          </div>
        }

        <div className="text-center mt-4">
          <button
            className="btn btn-outline-primary px-4 py-2"
            onClick={() => setShowCommentForm(!showCommentForm)}
          >
            <i
              className={`bi ${
                showCommentForm ? "bi-x-lg" : "bi-chat-left-text"
              } me-2`}
            ></i>
            {showCommentForm ? "إلغاء التعليق" : "أضف تعليقاً"}
          </button>
        </div>
      </div>

      {/* المنتجات المقترحة */}
      <div className="mt-5 position-relative">
        <h3 className="mb-4 border-bottom pb-3">
          <i className="bi bi-arrow-left-right text-primary me-2"></i>
          منتجات ذات صلة
        </h3>

        {/* مؤشر التحميل */}
        {loadingRelated && (
          <div
            className="loading-overlay"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255, 255, 255, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              borderRadius: "8px",
            }}
          >
            <div className="text-center">
              <div
                className="spinner-border text-primary mb-3"
                role="status"
                style={{ width: "3rem", height: "3rem" }}
              >
                <span className="visually-hidden">جارٍ التحميل...</span>
              </div>
              <p className="text-primary fw-bold">جاري تحميل المنتج...</p>
            </div>
          </div>
        )}

        <div className={`${loadingRelated ? "opacity-75" : ""}`}>
          {relatedProducts.length > 0 ?
            <div className="row">
              {relatedProducts.slice(0, 4).map((relatedProduct) => {
                const relUrlId =
                  relatedProduct.customId ||
                  (relatedProduct.numericId != null ?
                    relatedProduct.numericId
                  : relatedProduct.id || relatedProduct._id);
                return (
                  <div key={relUrlId} className="col-md-3 col-6 mb-4">
                    <div
                      className="card h-100 border-0 shadow-sm hover-shadow transition-all cursor-pointer"
                      onClick={() => handleRelatedProductClick(relatedProduct)}
                      style={{
                        pointerEvents: loadingRelated ? "none" : "auto",
                      }}
                    >
                      <div
                        className="position-relative"
                        style={{ height: "180px", overflow: "hidden" }}
                      >
                        <img
                          src={relatedProduct.images?.[0]}
                          className="card-img-top h-100 object-fit-cover"
                          alt={relatedProduct.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%236c757d' text-anchor='middle' dy='.3em'%3E" +
                              encodeURIComponent(relatedProduct.title) +
                              "%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                      <div className="card-body d-flex flex-column">
                        <h6 className="card-title text-truncate">
                          {relatedProduct.title}
                        </h6>
                        <p className="card-text text-primary fw-bold mb-0">
                          {relatedProduct.price.toFixed(2)} جنيه
                        </p>
                        {relatedProduct.originalPrice && (
                          <small className="text-muted text-decoration-line-through d-block">
                            {relatedProduct.originalPrice.toFixed(2)} جنيه
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          : <div className="text-center py-5 bg-light rounded-3">
              <i className="bi bi-box-seam fs-1 text-muted mb-3"></i>
              <p className="text-muted">لا توجد منتجات ذات صلة حالياً</p>
            </div>
          }
        </div>
      </div>
    </div>
  );
}
