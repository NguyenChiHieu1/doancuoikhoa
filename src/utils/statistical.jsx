export const processDataDaily = (data) => {
  // Hàm để định dạng ngày thành "dd/MM"
  const getDayMonth = (dateStr) => {
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
  };

  // Lấy danh sách năm cần so sánh
  const currentYear = new Date().getFullYear();
  const years = [currentYear];
  data.comparisons.forEach((comp) => {
    if (comp.data.length > 0) {
      const year = new Date(comp.data[0].interval).getFullYear();
      if (!years.includes(year)) {
        years.push(year);
      }
    }
  });

  // Tạo một đối tượng để lưu trữ doanh thu theo ngày/tháng cho từng năm
  const yearData = {};
  years.forEach((year) => {
    yearData[year] = {};
  });

  // Thêm dữ liệu hiện tại
  data.current.forEach((item) => {
    const date = new Date(item.interval);
    const year = date.getFullYear();
    const dayMonth = getDayMonth(item.interval);
    if (yearData[year]) {
      yearData[year][dayMonth] = item.totalRevenue;
    }
  });

  // Thêm dữ liệu so sánh
  data.comparisons.forEach((comp) => {
    comp.data.forEach((item) => {
      const date = new Date(item.interval);
      const year = date.getFullYear();
      const dayMonth = getDayMonth(item.interval);
      if (yearData[year]) {
        yearData[year][dayMonth] = item.totalRevenue;
      }
    });
  });

  // Tạo mảng chứa tất cả các ngày/tháng không trùng lặp
  const allDayMonths = new Set();
  Object.values(yearData).forEach((yearsData) => {
    Object.keys(yearsData).forEach((dayMonth) => {
      allDayMonths.add(dayMonth);
    });
  });

  // Chuyển đổi Set thành mảng và sắp xếp để có thứ tự ngày/tháng
  const sortedDayMonths = Array.from(allDayMonths).sort((a, b) => {
    const [dayA, monthA] = a.split("/").map(Number);
    const [dayB, monthB] = b.split("/").map(Number);
    return monthA - monthB || dayA - dayB;
  });

  // Tạo mảng cho mỗi năm
  const result = years.map((year) => {
    return sortedDayMonths.map((dayMonth) => {
      return yearData[year][dayMonth] || 0; // Nếu không có doanh thu, trả về 0
    });
  });

  // Trả về kết quả bao gồm mảng các tên ngày/tháng và dữ liệu doanh thu
  return {
    labels: sortedDayMonths,
    revenueData: result,
  };
};

export const processDataMonthly = (data) => {
  // Hàm để định dạng tháng thành "MM"
  const getMonth = (dateStr) => {
    const date = new Date(dateStr);
    return String(date.getMonth() + 1).padStart(2, "0");
  };

  // Lấy danh sách năm hiện tại và các năm trong dữ liệu so sánh
  const years = [];
  const currentYear = new Date().getFullYear();
  years.push(currentYear); // Thêm năm hiện tại

  data.comparisons.forEach((comp) => {
    if (comp.data.length > 0) {
      const year = new Date(comp.data[0].interval).getFullYear();
      if (!years.includes(year)) {
        years.push(year);
      }
    }
  });

  // Tạo một đối tượng để lưu trữ doanh thu theo tháng cho từng năm
  const yearData = {};
  years.forEach((year) => {
    yearData[year] = {};
  });

  // Thêm dữ liệu hiện tại
  data.current.forEach((item) => {
    const date = new Date(item.interval);
    const year = date.getFullYear();
    const month = getMonth(item.interval);
    if (yearData[year]) {
      yearData[year][month] = item.totalRevenue;
    }
  });

  // Thêm dữ liệu so sánh
  data.comparisons.forEach((comp) => {
    comp.data.forEach((item) => {
      const date = new Date(item.interval);
      const year = date.getFullYear();
      const month = getMonth(item.interval);
      if (yearData[year]) {
        yearData[year][month] = item.totalRevenue;
      }
    });
  });

  // Tạo mảng chứa tất cả các tháng không trùng lặp
  const allMonths = new Set();
  Object.values(yearData).forEach((yearsData) => {
    Object.keys(yearsData).forEach((month) => {
      allMonths.add(month);
    });
  });

  // Chuyển đổi Set thành mảng và sắp xếp để có thứ tự tháng
  const sortedMonths = Array.from(allMonths).sort((a, b) => {
    return Number(a) - Number(b);
  });

  // Tạo mảng cho mỗi năm
  const result = years.map((year) => {
    return sortedMonths.map((month) => {
      return yearData[year][month] || 0; // Nếu không có doanh thu, trả về 0
    });
  });

  // Trả về kết quả bao gồm mảng các tên tháng và dữ liệu doanh thu
  return {
    labels: sortedMonths,
    revenueData: result,
  };
};

export const processDataYearly = (data) => {
  // Lấy danh sách các năm từ dữ liệu hiện tại và dữ liệu so sánh
  const years = [];
  const currentYear = new Date().getFullYear();

  // Thêm năm hiện tại
  data.current.forEach((item) => {
    const year = new Date(item.interval).getFullYear();
    if (!years.includes(year)) {
      years.push(year);
    }
  });

  // Thêm các năm từ dữ liệu so sánh
  data.comparisons.forEach((comp) => {
    comp.data.forEach((item) => {
      const year = new Date(item.interval).getFullYear();
      if (!years.includes(year)) {
        years.push(year);
      }
    });
  });

  // Sắp xếp danh sách năm
  const sortedYears = years.sort((a, b) => a - b);

  // Tạo một đối tượng để lưu trữ doanh thu theo năm
  const yearData = {};
  sortedYears.forEach((year) => {
    yearData[year] = 0;
  });

  // Thêm dữ liệu hiện tại vào yearData
  data.current.forEach((item) => {
    const year = new Date(item.interval).getFullYear();
    if (yearData.hasOwnProperty(year)) {
      yearData[year] = item.totalRevenue;
    }
  });

  // Thêm dữ liệu so sánh vào yearData
  data.comparisons.forEach((comp) => {
    comp.data.forEach((item) => {
      const year = new Date(item.interval).getFullYear();
      if (yearData.hasOwnProperty(year)) {
        yearData[year] = item.totalRevenue;
      }
    });
  });

  // Tạo mảng revenueData từ yearData
  const revenueData = sortedYears.map((year) => yearData[year]);

  // Trả về kết quả bao gồm mảng các năm và dữ liệu doanh thu
  return {
    labels: sortedYears,
    revenueData: [revenueData], // Đưa vào mảng để phù hợp với nhiều năm so sánh
  };
};

export const processDataDailyOrder = (data) => {
  // Hàm để định dạng ngày thành "dd/MM"
  const getDayMonth = (dateStr) => {
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
  };

  // Lấy danh sách năm cần so sánh
  const currentYear = new Date().getFullYear();
  const years = [currentYear];
  data.comparisons.forEach((comp) => {
    if (comp.data.length > 0) {
      const year = new Date(comp.data[0].interval).getFullYear();
      if (!years.includes(year)) {
        years.push(year);
      }
    }
  });

  // Tạo một đối tượng để lưu trữ doanh thu theo ngày/tháng cho từng năm
  const yearData = {};
  years.forEach((year) => {
    yearData[year] = {};
  });

  // Thêm dữ liệu hiện tại
  data.current.forEach((item) => {
    const date = new Date(item.interval);
    const year = date.getFullYear();
    const dayMonth = getDayMonth(item.interval);
    if (yearData[year]) {
      yearData[year][dayMonth] = item.totalOrders;
    }
  });

  // Thêm dữ liệu so sánh
  data.comparisons.forEach((comp) => {
    comp.data.forEach((item) => {
      const date = new Date(item.interval);
      const year = date.getFullYear();
      const dayMonth = getDayMonth(item.interval);
      if (yearData[year]) {
        yearData[year][dayMonth] = item.totalOrders;
      }
    });
  });

  // Tạo mảng chứa tất cả các ngày/tháng không trùng lặp
  const allDayMonths = new Set();
  Object.values(yearData).forEach((yearsData) => {
    Object.keys(yearsData).forEach((dayMonth) => {
      allDayMonths.add(dayMonth);
    });
  });

  // Chuyển đổi Set thành mảng và sắp xếp để có thứ tự ngày/tháng
  const sortedDayMonths = Array.from(allDayMonths).sort((a, b) => {
    const [dayA, monthA] = a.split("/").map(Number);
    const [dayB, monthB] = b.split("/").map(Number);
    return monthA - monthB || dayA - dayB;
  });

  // Tạo mảng cho mỗi năm
  const result = years.map((year) => {
    return sortedDayMonths.map((dayMonth) => {
      return yearData[year][dayMonth] || 0; // Nếu không có doanh thu, trả về 0
    });
  });

  // Trả về kết quả bao gồm mảng các tên ngày/tháng và dữ liệu doanh thu
  return {
    labels: sortedDayMonths,
    orderData: result,
  };
};

export const processDataMonthlyOrder = (data) => {
  // Hàm để định dạng tháng thành "MM"
  const getMonth = (dateStr) => {
    const date = new Date(dateStr);
    return String(date.getMonth() + 1).padStart(2, "0");
  };

  // Lấy danh sách năm hiện tại và các năm trong dữ liệu so sánh
  const years = [];
  const currentYear = new Date().getFullYear();
  years.push(currentYear); // Thêm năm hiện tại

  data.comparisons.forEach((comp) => {
    if (comp.data.length > 0) {
      const year = new Date(comp.data[0].interval).getFullYear();
      if (!years.includes(year)) {
        years.push(year);
      }
    }
  });

  // Tạo một đối tượng để lưu trữ doanh thu theo tháng cho từng năm
  const yearData = {};
  years.forEach((year) => {
    yearData[year] = {};
  });

  // Thêm dữ liệu hiện tại
  data.current.forEach((item) => {
    const date = new Date(item.interval);
    const year = date.getFullYear();
    const month = getMonth(item.interval);
    if (yearData[year]) {
      yearData[year][month] = item.totalOrders;
    }
  });

  // Thêm dữ liệu so sánh
  data.comparisons.forEach((comp) => {
    comp.data.forEach((item) => {
      const date = new Date(item.interval);
      const year = date.getFullYear();
      const month = getMonth(item.interval);
      if (yearData[year]) {
        yearData[year][month] = item.totalOrders;
      }
    });
  });

  // Tạo mảng chứa tất cả các tháng không trùng lặp
  const allMonths = new Set();
  Object.values(yearData).forEach((yearsData) => {
    Object.keys(yearsData).forEach((month) => {
      allMonths.add(month);
    });
  });

  // Chuyển đổi Set thành mảng và sắp xếp để có thứ tự tháng
  const sortedMonths = Array.from(allMonths).sort((a, b) => {
    return Number(a) - Number(b);
  });

  // Tạo mảng cho mỗi năm
  const result = years.map((year) => {
    return sortedMonths.map((month) => {
      return yearData[year][month] || 0; // Nếu không có doanh thu, trả về 0
    });
  });

  // Trả về kết quả bao gồm mảng các tên tháng và dữ liệu doanh thu
  return {
    labels: sortedMonths,
    orderData: result,
  };
};

export const processDataYearlyOrder = (data) => {
  // Lấy danh sách các năm từ dữ liệu hiện tại và dữ liệu so sánh
  const years = [];
  const currentYear = new Date().getFullYear();

  // Thêm năm hiện tại
  data.current.forEach((item) => {
    const year = new Date(item.interval).getFullYear();
    if (!years.includes(year)) {
      years.push(year);
    }
  });

  // Thêm các năm từ dữ liệu so sánh
  data.comparisons.forEach((comp) => {
    comp.data.forEach((item) => {
      const year = new Date(item.interval).getFullYear();
      if (!years.includes(year)) {
        years.push(year);
      }
    });
  });

  // Sắp xếp danh sách năm
  const sortedYears = years.sort((a, b) => a - b);

  // Tạo một đối tượng để lưu trữ doanh thu theo năm
  const yearData = {};
  sortedYears.forEach((year) => {
    yearData[year] = 0;
  });

  // Thêm dữ liệu hiện tại vào yearData
  data.current.forEach((item) => {
    const year = new Date(item.interval).getFullYear();
    if (yearData.hasOwnProperty(year)) {
      yearData[year] = item.totalOrders;
    }
  });

  // Thêm dữ liệu so sánh vào yearData
  data.comparisons.forEach((comp) => {
    comp.data.forEach((item) => {
      const year = new Date(item.interval).getFullYear();
      if (yearData.hasOwnProperty(year)) {
        yearData[year] = item.totalOrders;
      }
    });
  });

  // Tạo mảng orderData từ yearData
  const orderData = sortedYears.map((year) => yearData[year]);

  // Trả về kết quả bao gồm mảng các năm và dữ liệu doanh thu
  return {
    labels: sortedYears,
    orderData: [orderData], // Đưa vào mảng để phù hợp với nhiều năm so sánh
  };
};
