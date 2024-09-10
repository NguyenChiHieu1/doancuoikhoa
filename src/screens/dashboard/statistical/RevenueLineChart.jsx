import React, { useState, useEffect, useRef } from "react";
import AdminHome from "../AdminHome";
import {
  useGetRevenueByTimeQuery,
  useGetOrderCountTimeQuery,
} from "../../../store/service/statisticalService";
import toast, { Toaster } from "react-hot-toast";
import "./statisical.css";
import ReactToPrint from "react-to-print";
import ChartBar from "../../../utils/ChartBar";
import ChartLine from "../../../utils/ChartLine";
import {
  processDataDaily,
  processDataMonthly,
  processDataYearly,
  processDataDailyOrder,
  processDataMonthlyOrder,
  processDataYearlyOrder,
} from "../../../utils/statistical";

const colors = [
  "rgba(255, 0, 0, 0.5)",
  "rgba(255, 165, 0, 0.5)",
  "rgba(255, 255, 0, 0.5)",
  "rgba(0, 128, 0, 0.5)",
  "rgba(0, 0, 255, 0.5)",
  "rgba(75, 0, 130, 0.5)",
  "rgba(238, 130, 238, 0.5)",
  "rgba(245, 0, 0, 0.5)",
  "rgba(265, 165, 0, 0.5)",
  "rgba(275, 255, 0, 0.5)",
  "rgba(0, 190, 0, 0.5)",
  "rgba(12, 0, 255, 0.5)",
  "rgba(45, 0, 130, 0.5)",
  "rgba(78, 130, 238, 0.5)",
];

const RevenueLineChart = () => {
  const [hiddenFilter, setHiddenFilter] = useState({ type: "", hidden: false });
  const componentRef = useRef();
  const [run, setRun] = useState(false);
  const [chartBar, setChartBar] = useState(true);
  const [dataShow, setDataShow] = useState({});
  const [dataShowOrder, setDataShowOrder] = useState({});
  const [value, setValue] = useState({
    startDate: "",
    endDate: "",
    interval: "",
    compareYears: 0,
  });
  // -----------Check err
  const [errors, setErrors] = useState({
    startDateError: "",
    endDateError: "",
    intervalError: "",
  });

  // Hàm kiểm tra lỗi
  const validateInputs = () => {
    let isValid = true;
    let newErrors = {
      startDateError: "",
      endDateError: "",
      intervalError: "",
    };

    const startDate = new Date(value.startDate);
    const endDate = new Date(value.endDate);
    if (!startDate || !endDate || !value.interval) {
      toast.error("Vui lòng chọn thời gian thống kê trước !!!");
      isValid = false;
    }

    if (startDate > endDate) {
      newErrors.startDateError =
        "Ngày bắt đầu không được lớn hơn ngày kết thúc.";
      isValid = false;
    }

    if (value.interval === "daily" || value.interval === "monthly") {
      if (startDate.getFullYear() !== endDate.getFullYear()) {
        newErrors.intervalError =
          "Ngày bắt đầu và Ngày kết thúc phải cùng năm đối với khoảng thời gian lọc theo ngày và theo tháng.";
        isValid = false;
      }
    }

    // if (value.interval === "daily" || value.interval === "monthly") {
    //   if (startDate.getFullYear() !== endDate.getFullYear()) {
    //     newErrors.intervalError =
    //       "Start Date and End Date must be in the same year for daily and monthly intervals.";
    //     isValid = false;
    //   }
    // }

    setErrors(newErrors);
    return isValid;
  };

  function handleFilterTime() {
    if (validateInputs()) {
      setRun(true);
    } else {
      toast.error("`Vui lòng sửa lỗi trước.`");
    }
  }
  // --------call API
  const { data: dataRevenueTime } = useGetRevenueByTimeQuery(value, {
    skip: !run,
  });

  const { data: dataOrderTime } = useGetOrderCountTimeQuery(value, {
    skip: !run,
  });

  const handleChange = (e) => {
    setValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (dataOrderTime) {
      //lấy label year của startDate
      let yearStart = new Date(value.startDate).getFullYear();
      let yearEnd = new Date(value.endDate).getFullYear();
      // console.log(year);
      // Lọc ddieuf kiện
      let result = processDataYearlyOrder(dataOrderTime || []);
      if (value.interval === "daily") {
        result = processDataDailyOrder(dataOrderTime || []);
      } else if (value.interval === "monthly") {
        result = processDataMonthlyOrder(dataOrderTime || []);
      }
      console.log("result", result);
      let datasets = [];
      if (Array.isArray(result?.orderData)) {
        result?.orderData?.forEach((item, index) => {
          let ipush = {
            label:
              yearStart !== yearEnd
                ? `Năm: ${yearStart}-${yearEnd}`
                : `Năm ${+yearStart - index}`,

            data: item,
            borderColor: colors[index],
            backgroundColor: colors[index],
            // fill: true,
          };
          datasets.push(ipush);
        });
      }

      // console.log("datasets", datasets);
      setDataShowOrder({
        labels: result?.labels,
        datasets: datasets,
      });
    }
  }, [dataOrderTime]);

  useEffect(() => {
    if (dataRevenueTime) {
      //lấy label year của startDate
      let yearStart = new Date(value.startDate).getFullYear();
      let yearEnd = new Date(value.endDate).getFullYear();
      // console.log(year);
      // Lọc ddieuf kiện
      let result = processDataYearly(dataRevenueTime || []);

      if (value.interval === "daily") {
        result = processDataDaily(dataRevenueTime || []);
        // console.log("result-revenue", result);
      } else if (value.interval === "monthly") {
        result = processDataMonthly(dataRevenueTime || []);
      }
      console.log("revenue", result);
      let datasets = [];
      if (Array.isArray(result?.revenueData)) {
        result?.revenueData?.forEach((item, index) => {
          let ipush = {
            label:
              yearStart !== yearEnd
                ? `Năm: ${yearStart}-${yearEnd}`
                : `Năm ${+yearStart - index}`,
            data: item,
            borderColor: colors[index],
            backgroundColor: colors[index],
            // fill: true,
          };
          datasets.push(ipush);
        });
      }

      // console.log("datasets", datasets);
      setDataShow({
        labels: result?.labels,
        datasets: datasets,
      });
      setTimeout(() => {
        setRun(false);
      }, 2000);
    }
  }, [dataRevenueTime]);

  return (
    <AdminHome>
      <div className="statiscal-revenue">
        <div className="p-4 ">
          <div className="space-x-10 mb-4 w-full">
            <div className="flex items-center justify-between gap-4 w-full">
              <div className="flex items-center flex-col gap-4 w-full">
                <div className="flex items-center flex-row gap-4 w-full">
                  <label htmlFor="startDate" className="text-gray-700">
                    Ngày bắt đầu:
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={value.startDate}
                    className="p-2 border rounded-lg w-44"
                    onChange={handleChange}
                  />

                  <hr className="border-gray-300 w-4 mx-2" />

                  <label htmlFor="endDate" className="text-gray-700">
                    Ngày kết thúc:
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={value.endDate}
                    className="p-2 border rounded-lg w-44"
                    onChange={handleChange}
                  />

                  <select
                    id="interval"
                    name="interval"
                    value={value.interval}
                    className="p-2 border rounded-lg w-36"
                    onChange={handleChange}
                  >
                    <option value="">Lọc theo</option>
                    <option value="daily">Ngày</option>
                    <option value="monthly">Tháng</option>
                    <option value="yearly">Năm</option>
                  </select>

                  <button
                    className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
                    onClick={handleFilterTime}
                  >
                    Lọc
                  </button>
                </div>

                <div className="flex items-center justify-start gap-4 w-full">
                  {errors.startDateError && (
                    <div className="text-red-600">{errors.startDateError}</div>
                  )}
                  {errors.endDateError && (
                    <div className="text-red-600">{errors.endDateError}</div>
                  )}
                  {errors.intervalError && (
                    <div className="text-red-600">{errors.intervalError}</div>
                  )}
                </div>
              </div>

              <div className="container-statis">
                <i className="gear-icon-statis bi bi-gear"></i>
                <div className="value-setting-statis">
                  <ul>
                    <li
                      className="menu-item-statis"
                      onClick={() => {
                        setHiddenFilter({
                          type: "compare-years",
                          hidden: false,
                        });
                      }}
                    >
                      So sánh các năm
                    </li>
                    <li
                      className="menu-item-statis"
                      onClick={() => {
                        setChartBar(true);
                      }}
                    >
                      Biểu đồ cột
                    </li>
                    <li
                      className="menu-item-statis"
                      onClick={() => {
                        setChartBar(false);
                      }}
                    >
                      Biểu đồ đường
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div
              className="flex items-center gap-4 mt-3"
              style={{
                display:
                  hiddenFilter.type === "compare-years" &&
                  hiddenFilter.hidden === false
                    ? "block"
                    : "none",
              }}
            >
              <label htmlFor="compareYears" className="text-gray-700">
                So sánh các năm:
              </label>
              <input
                type="number"
                id="compareYears"
                name="compareYears"
                min={0}
                value={value.compareYears}
                className="p-2 border rounded-lg w-36"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="mt-2 border rounded-md p-4">
          <Toaster position="top-right" />
          <ReactToPrint
            trigger={() => (
              <div className="print-bill-order-user flex justify-end p-2">
                <button>
                  <i className="bi bi-printer"></i>
                </button>
              </div>
            )}
            content={() => componentRef.current}
            onBeforePrint={() => console.log("Preparing to print")}
            onAfterPrint={() => console.log("Print finished")}
            onError={(error) => console.error("Print error:", error)}
          />
          <div
            className="w-1/2 max-h-96 flex flex-row gap-4"
            ref={componentRef}
          >
            {dataShow?.labels?.length > 0 ? (
              chartBar ? (
                <ChartBar dataChart={dataShow} titleY={"Revenue"} />
              ) : (
                <ChartLine dataChart={dataShow} titleY={"Revenue"} />
              )
            ) : (
              ""
            )}
            {dataShowOrder?.labels?.length > 0 ? (
              chartBar ? (
                <ChartBar dataChart={dataShowOrder} titleY={"Order"} />
              ) : (
                <ChartLine dataChart={dataShowOrder} titleY={"Order"} />
              )
            ) : (
              " Không có dữ liệu"
            )}
          </div>
        </div>
      </div>
    </AdminHome>
  );
};

export default RevenueLineChart;
