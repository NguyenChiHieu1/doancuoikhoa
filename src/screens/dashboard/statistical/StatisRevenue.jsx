import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần biểu đồ mà bạn sẽ sử dụng
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// const processData = (data) => {
//   // Hàm để định dạng tháng thành "MM"
//   const getMonth = (dateStr) => {
//     const date = new Date(dateStr);
//     return String(date.getMonth() + 1).padStart(2, "0");
//   };

//   // Lấy danh sách năm hiện tại và các năm trong dữ liệu so sánh
//   const years = [];
//   const currentYear = new Date().getFullYear();
//   years.push(currentYear); // Thêm năm hiện tại

//   data.comparisons.forEach((comp) => {
//     if (comp.data.length > 0) {
//       const year = new Date(comp.data[0].interval).getFullYear();
//       if (!years.includes(year)) {
//         years.push(year);
//       }
//     }
//   });

//   // Tạo một đối tượng để lưu trữ doanh thu theo tháng cho từng năm
//   const yearData = {};
//   years.forEach((year) => {
//     yearData[year] = {};
//   });

//   // Thêm dữ liệu hiện tại
//   data.current.forEach((item) => {
//     const date = new Date(item.interval);
//     const year = date.getFullYear();
//     const month = getMonth(item.interval);
//     if (yearData[year]) {
//       yearData[year][month] = item.totalRevenue;
//     }
//   });

//   // Thêm dữ liệu so sánh
//   data.comparisons.forEach((comp) => {
//     comp.data.forEach((item) => {
//       const date = new Date(item.interval);
//       const year = date.getFullYear();
//       const month = getMonth(item.interval);
//       if (yearData[year]) {
//         yearData[year][month] = item.totalRevenue;
//       }
//     });
//   });

//   // Tạo mảng chứa tất cả các tháng không trùng lặp
//   const allMonths = new Set();
//   Object.values(yearData).forEach((yearsData) => {
//     Object.keys(yearsData).forEach((month) => {
//       allMonths.add(month);
//     });
//   });

//   // Chuyển đổi Set thành mảng và sắp xếp để có thứ tự tháng
//   const sortedMonths = Array.from(allMonths).sort((a, b) => {
//     return Number(a) - Number(b);
//   });

//   // Tạo mảng cho mỗi năm
//   const result = years.map((year) => {
//     return sortedMonths.map((month) => {
//       return yearData[year][month] || 0; // Nếu không có doanh thu, trả về 0
//     });
//   });

//   // Trả về kết quả bao gồm mảng các tên tháng và dữ liệu doanh thu
//   return {
//     labels: sortedMonths,
//     revenueData: result,
//   };
// };

// const data = {
//   current: [
//     {
//       totalRevenue: 7717200,
//       interval: "2024-08",
//     },
//   ],
//   comparisons: [
//     {
//       label: "Năm 1 Trước",
//       data: [
//         {
//           totalRevenue: 80000,
//           interval: "2023-08",
//         },
//       ],
//     },
//     {
//       label: "Năm 2 Trước",
//       data: [
//         {
//           totalRevenue: 2550600,
//           interval: "2022-09",
//         },
//       ],
//     },
//     {
//       label: "Năm 3 Trước",
//       data: [],
//     },
//     {
//       label: "Năm 4 Trước",
//       data: [],
//     },
//     {
//       label: "Năm 5 Trước",
//       data: [],
//     },
//   ],
// };

const processData = (data) => {
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

// Ví dụ sử dụng
const data = {
  current: [
    {
      totalRevenue: 7717200,
      interval: "2024",
    },
  ],
  comparisons: [
    // {
    //   label: "Năm 1 Trước",
    //   data: [
    //     {
    //       totalRevenue: 80000,
    //       interval: "2023",
    //     },
    //   ],
    // },
    // {
    //   label: "Năm 2 Trước",
    //   data: [
    //     {
    //       totalRevenue: 2550600,
    //       interval: "2022",
    //     },
    //   ],
    // },
    // {
    //   label: "Năm 3 Trước",
    //   data: [],
    // },
    // {
    //   label: "Năm 4 Trước",
    //   data: [],
    // },
    // {
    //   label: "Năm 5 Trước",
    //   data: [],
    // },
  ],
};

const colors = [
  "rgba(255, 99, 132, 0.5)",
  "rgba(54, 162, 235, 0.5)",
  "rgba(255, 206, 86, 0.5)",
  "rgba(75, 192, 192, 0.5)",
  "rgba(153, 102, 255, 0.5)",
  "rgba(255, 159, 64, 0.5)",
  "rgba(199, 199, 199, 0.5)",
  "rgba(83, 102, 255, 0.5)",
  "rgba(102, 204, 102, 0.5)",
  "rgba(255, 102, 102, 0.5)",
];

const StatisRevenue = () => {
  const result = processData(data || []);
  let datasetss = [];
  if (Array.isArray(result?.revenueData)) {
    result?.revenueData?.forEach((item, index) => {
      let ipush = {
        label: `Year ${index}`,
        data: item,
        borderColor: colors[index],
        backgroundColor: colors[index],
        fill: true,
      };
      datasetss.push(ipush);
    });
  }
  // result?.revenueData?.map((item, index) => {
  //   let ipush = {
  //     label: `Year ${index}`,
  //     data: item,
  //     borderColor: colors[index],
  //     backgroundColor: colors[index],
  //     fill: true,
  //   };
  //   datasetss.push(ipush);
  // });

  const dataLabel = {
    labels: result?.labels,
    datasets: datasetss,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Biểu đồ doanh thu hàng tháng",
      },
    },
  };

  return <Bar data={dataLabel} options={options} />;
};
export default StatisRevenue;
