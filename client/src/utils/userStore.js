// Storage helper for user transactions (bookings & gear orders)
// Guarantees persistence across sessions, both locally and in cloud demo mode

const BOOKINGS_KEY = 'wildtrail_user_bookings';
const ORDERS_KEY = 'wildtrail_user_orders';

export const getLocalBookings = () => {
  try {
    const data = localStorage.getItem(BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveLocalBooking = (booking) => {
  try {
    const existing = getLocalBookings();
    const index = existing.findIndex((b) => b._id === booking._id);
    let updated;
    if (index >= 0) {
      updated = [...existing];
      updated[index] = { ...updated[index], ...booking };
    } else {
      updated = [booking, ...existing];
    }
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const cancelLocalBooking = (id) => {
  try {
    const existing = getLocalBookings();
    const updated = existing.map((b) =>
      b._id === id ? { ...b, status: 'Cancelled' } : b
    );
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const getLocalOrders = () => {
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveLocalOrder = (order) => {
  try {
    const existing = getLocalOrders();
    const index = existing.findIndex((o) => o._id === order._id);
    let updated;
    if (index >= 0) {
      updated = [...existing];
      updated[index] = { ...updated[index], ...order };
    } else {
      updated = [order, ...existing];
    }
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
};

export const mergeRecords = (apiRecords = [], localRecords = []) => {
  const map = new Map();
  // Local records first
  (localRecords || []).forEach((item) => {
    if (item && item._id) {
      map.set(item._id, item);
    }
  });
  // API records update or add
  (apiRecords || []).forEach((item) => {
    if (item && item._id) {
      map.set(item._id, item);
    }
  });
  // Return sorted descending by createdAt
  return Array.from(map.values()).sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });
};
