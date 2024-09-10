import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  //   Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
  //   Filler
);

const ChartLine = ({ dataChart, titleY }) => {
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
            return `${context.dataset.label}: ${context.raw.toLocaleString(
              "vi-VN"
            )} VNĐ`;
          },
        },
        // callbacks: {
        //   label: function (tooltipItem) {
        //     return `Value: ${tooltipItem.raw}`;
        //   },
        // },
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
        // stacked: true,
        title: {
          display: true,
          text: titleY == "Order" ? "Đơn hàng" : "Doanh thu",
        },
        ticks: {
          callback: function (value) {
            return value.toLocaleString("vi-VN") + " VNĐ";
          },
        },
      },
    },
  };
  return <Line data={dataChart} options={options} />;
};
export default ChartLine;
