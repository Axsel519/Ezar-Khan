/** @format */

import api from "./api";

const couponsAPI = {
  // Get all coupons (Admin only)
  getAll: async () => {
    const response = await api.get("/coupons");
    return response.data;
  },

  // Get single coupon by ID (Admin only)
  getById: async (id) => {
    const response = await api.get(`/coupons/${id}`);
    return response.data;
  },

  // Create new coupon (Admin only)
  create: async (couponData) => {
    const response = await api.post("/coupons", couponData);
    return response.data;
  },

  // Update coupon (Admin only)
  update: async (id, couponData) => {
    const response = await api.patch(`/coupons/${id}`, couponData);
    return response.data;
  },

  // Delete coupon (Admin only)
  delete: async (id) => {
    const response = await api.delete(`/coupons/${id}`);
    return response.data;
  },

  // Validate coupon (Any authenticated user)
  validate: async (code) => {
    const response = await api.get(`/coupons/validate?code=${code}`);
    return response.data;
  },
};

export default couponsAPI;
