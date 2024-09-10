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
  Filler,
} from "chart.js";

// Đăng ký các thành phần biểu đồ mà bạn sẽ sử dụng
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartBar = ({ dataChart, titleY }) => {
  let options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text:
          titleY !== "Order"
            ? " Thống Kê Doanh Thu Theo Khoảng Thời Gian"
            : "Thống Kê Đơn Hàng Bán Được Theo Khoảng Thời Gian",
        font: {
          size: 15,
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          weight: "bold",
          lineHeight: 1.2,
        },
        color: "#333",
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            if (titleY !== "Order") {
              return `${context.dataset.label}: ${context.raw.toLocaleString(
                "vi-VN"
              )} VNĐ`;
            } else {
              return `${context.dataset.label}: ${context.raw.toLocaleString(
                "vi-VN"
              )} orders`;
            }
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Thời gian",
        },
      },
      y: {
        title: {
          display: true,
          text: titleY == "Order" ? "Đơn hàng" : "Doanh thu",
        },
        ticks: {
          callback: function (value) {
            if (titleY !== "Order") {
              return value.toLocaleString("vi-VN") + " VNĐ";
            } else {
              return value.toLocaleString("vi-VN");
            }
          },
        },
      },
    },
  };

  return <Bar data={dataChart} options={options} />;
};

export default ChartBar;
