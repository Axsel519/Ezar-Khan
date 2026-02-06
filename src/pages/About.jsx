/** @format */

import React from "react";
import "../style.css";

export default function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                <span className="text-primary">Ezar Khan</span> - علامة الأدوات
                المنزلية الذكية
              </h1>
              <p className="lead mb-4">
                نعمل على تقديم حلول يومية تجمع بين الجودة العالية والتصميم
                العملي، لأننا نؤمن أن الأدوات المنزلية الجيدة تصنع الفارق في
                حياة كل أسرة.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="about-hero-image">
                <div className="image-grid">
                  <div className="grid-item kitchen-tools">
                    <img src="../../public/phoabout1.jpg" alt="" />
                  </div>
                  <div className="grid-item home-organization">
                    <img src="../../public/phoabout3.jpg" alt="" />
                  </div>
                  <div className="grid-item quality-products">
                    <img src="../../public/phoabout2.jpg" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div
        className="vision-mission-section py-5 
      "
      >
        <div className="container abou-pag">
          <div className="row">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="vision-card p-4 p-lg-5 rounded-4 shadow-sm h-100">
                <h2 className="h3 fw-bold mb-4">رؤيتنا</h2>
                <p className="mb-4">
                  أن نكون الاختيار الأول لكل أسرة تبحث عن أدوات منزلية موثوقة
                  تدوم طويلًا وتضيف قيمة حقيقية للحياة اليومية، مع تجربة شراء
                  سهلة وخدمة عملاء تهتم بكل التفاصيل.
                </p>
                <p className="mb-0 text-muted">
                  نغيّر مفهوم الأدوات المنزلية من مجرد منتجات إلى تجربة استخدام
                  حقيقية تُحدث فرقًا ملموسًا في كل تفاصيل المنزل.
                </p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="mission-card p-4 p-lg-5 rounded-4 shadow-sm h-100">
                <h2 className="h3 fw-bold mb-4">رسالتنا</h2>
                <p className="mb-4">
                  تقديم أدوات منزلية عملية، موثوقة، وسهلة الاستخدام، تم اختيارها
                  بعناية لتخدم احتياجات الحياة اليومية، مع توفير تجربة شراء سلسة
                  وخدمة عملاء تضع راحة العميل في المقام الأول.
                </p>
                <ul className="list-unstyled mission-list">
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    إنجاز المهام اليومية بكفاءة
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    توفير الوقت والمجهود
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    تنظيم المنزل بطريقة أفضل
                  </li>
                  <li className="mb-0">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    الحصول على قيمة حقيقية مقابل السعر
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="values-section py-5 bg-light abou-pag">
        <div className="container">
          <h2 className="text-center mb-5">قيمنا الأساسية</h2>
          <div className="row g-4">
            {[
              {
                icon: "bi-award-fill",
                title: "الجودة",
                description: "نختار منتجاتنا بعناية لتدوم وتؤدي بكفاءة",
              },
              {
                icon: "bi-shield-check",
                title: "الشفافية",
                description: "وضوح في الأسعار والمواصفات وسياسة البيع",
              },
              {
                icon: "bi-tools",
                title: "العملية",
                description: "حلول حقيقية تناسب الاستخدام اليومي",
              },
              {
                icon: "bi-clock-history",
                title: "الالتزام",
                description: "احترام وقت العميل وتوقعاته",
              },
              {
                icon: "bi-people-fill",
                title: "خدمة العملاء",
                description: "دعم متواصل واهتمام بكل تفاصيل رضاكم",
              },
              {
                icon: "bi-lightbulb-fill",
                title: "الابتكار",
                description: "بحث مستمر عن حلول أفضل وأكثر ذكاءً",
              },
            ].map((value, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="value-card p-4 rounded-3 shadow-sm h-100">
                  <div className="value-icon mb-3">
                    <i className={`bi ${value.icon} fs-2 text-primary`}></i>
                  </div>
                  <h4 className="h5 fw-bold mb-2">{value.title}</h4>
                  <p className="text-muted mb-0">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="why-us-section py-5 abou-pag">
        <div className="container">
          <h2 className="text-center mb-5">لماذا تختارنا؟</h2>
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="feature-card text-center p-4">
                <h4 className="h5 fw-bold mb-3">جودة مختارة بعناية</h4>
                <p className="text-muted">
                  نتعامل مع موردين موثوقين ونخضع المنتجات لمعايير اختيار دقيقة
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="feature-card text-center p-4">
                <h4 className="h5 fw-bold mb-3">منتجات عملية</h4>
                <p className="text-muted">
                  حلول حقيقية تناسب الاستخدام اليومي وتوفر الوقت والجهد
                </p>
              </div>
            </div>
            <div className="col-lg-4 abou-pag">
              <div className="feature-card text-center p-4">
                <h4 className="h5 fw-bold mb-3">أسعار تنافسية</h4>
                <p className="text-muted">
                  عروض تناسب الجميع مع ضمان القيمة الحقيقية مقابل السعر
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="feature-card text-center p-4">
                <h4 className="h5 fw-bold mb-3">خدمة عملاء موثوقة</h4>
                <p className="text-muted">
                  فريق دعم متواصل يهتم بكل تفاصيل رضاكم وتجربتكم
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="feature-card text-center p-4">
                <h4 className="h5 fw-bold mb-3">تجربة تسوق سهلة</h4>
                <p className="text-muted">
                  واجهة بديهية وتصفية ذكية للعثور على ما تريد بسرعة
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="feature-card text-center p-4">
                <h4 className="h5 fw-bold mb-3">شراء آمن</h4>
                <p className="text-muted">
                  معاملات مشفرة وضمان استرجاع وسياسات شفافة
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="story-section py-5 bg-light abou-pag">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 order-lg-2">
              <div className="story-image p-4">
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h5 className="fw-bold">التأسيس </h5>
                      <p>
                        بداية الرحلة بفكرة بسيطة: أدوات منزلية أفضل لحياة أسهل
                      </p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h5 className="fw-bold">التوسع </h5>
                      <p>إضافة خطوط منتجات جديدة وبناء شبكة موردين موثوقين</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h5 className="fw-bold">التحول الرقمي </h5>
                      <p>إطلاق المتجر الإلكتروني والوصول لعملاء جدد</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h5 className="fw-bold">اليوم</h5>
                      <p>
                        علامة رائدة في الأدوات المنزلية العميلة بمئات المنتجات
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 order-lg-1 abou-pag">
              <h2 className="mb-4">قصتنا</h2>
              <p className="mb-4">
                تأسست إيزار خان انطلاقًا من إيماننا بأن الأدوات المنزلية ليست
                مجرد منتجات، بل حلول يومية تؤثر بشكل مباشر على راحة الأسرة وجودة
                الحياة داخل المنزل.
              </p>
              <p className="mb-4">
                بدأنا رحلتنا بهدف توفير أدوات منزلية تجمع بين الاعتمادية،
                العملية، والتصميم العصري لتناسب مختلف الأذواق والاحتياجات.
              </p>
              <p className="mb-4">
                نحرص على التعامل مع موردين موثوقين، ونخضع منتجاتنا لمعايير
                اختيار دقيقة تضمن المتانة وسهولة الاستخدام والسلامة.
              </p>
              <p className="mb-0">
                نتابع باستمرار تطورات السوق واحتياجات العملاء لنقدم منتجات حديثة
                تواكب أسلوب الحياة العصري.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Philosophy */}
      <div className="philosophy-section py-5 abou-pag">
        <div className="container">
          <div className="text-center max-width-800 mx-auto">
            <div className="philosophy-icon mb-4">
              <i className="bi bi-heart-fill fs-1 text-danger"></i>
            </div>
            <h2 className="mb-4">فلسفتنا في العمل</h2>
            <p className="lead mb-4">
              نعمل بروح الفريق، ونضع رضا العميل في مقدمة أولوياتنا، سواء من حيث
              جودة المنتج أو سرعة التوصيل أو خدمة ما بعد البيع. هدفنا ليس البيع
              فقط، بل بناء علاقة ثقة طويلة المدى مع كل عميل.
            </p>
            <div className="stats row mt-5">
              <div className="col-md-3 col-6 mb-4">
                <div className="stat-number display-6 fw-bold text-primary">
                  +500
                </div>
                <div className="stat-label">منتج متنوع</div>
              </div>
              <div className="col-md-3 col-6 mb-4">
                <div className="stat-number display-6 fw-bold text-success">
                  +10K
                </div>
                <div className="stat-label">عميل راضٍ</div>
              </div>
              <div className="col-md-3 col-6 mb-4">
                <div className="stat-number display-6 fw-bold text-warning">
                  12+
                </div>
                <div className="stat-label">سنة خبرة</div>
              </div>
              <div className="col-md-3 col-6 mb-4">
                <div className="stat-number display-6 fw-bold text-info">
                  24/7
                </div>
                <div className="stat-label">دعم فني</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
