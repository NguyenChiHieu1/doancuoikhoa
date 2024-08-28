import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import formatMoney from "../../utils/formatMoney";
import { useGetCateLevel123Query } from "../../store/service/cateService";
import { useParams, Link } from "react-router-dom";

function valuetext(value) {
  return `${formatMoney(value)}`;
}

const CategoryCondition = ({ setMinMax, queryCate }) => {
  const { cid } = useParams();
  //Min-Max -Oke
  const [value, setValue] = useState([0, 5000000]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  function handleFilter() {
    setMinMax(value);
  }
  // --------------------------------Category-------------------
  const { data, isLoading, isSuccess, error } = useGetCateLevel123Query();

  const [dataCate123, setDataCate123] = useState([]);
  const [addCate, setAddCate] = useState(false);
  const [addCateChild, setAddCateChild] = useState({
    ind: "",
    visibiliti: false,
  });
  //
  const onAddCategory = () => {
    setAddCate(!addCate);
  };
  const onAddCategoryChild = (index) => {
    setAddCateChild({
      ind: index,
      visibiliti: !addCateChild.visibiliti,
    });
  };

  useEffect(() => {
    if (data) {
      let dataInput = [...(data?.data || [])];
      // console.log("queryCate", queryCate);
      // console.log("queryCate-level1-id", queryCate?.level1?.id);
      if (queryCate) {
        // console.log("cid", cid);
        dataInput = dataInput.filter((item) => {
          return item?.parent?._id === queryCate?.level1?.id;
        });
        // console.log("dataInput-filter", dataInput);
      }
      setDataCate123(dataInput);
    }
  }, [data, queryCate]);

  useEffect(() => {
    // console.log("dataCate123", dataCate123);
    // console.log("dataCate123?.children", dataCate123?.[0]?.children);
  }, [addCate]);

  return (
    <>
      <div className="page_cateproduct_condition">
        {cid && (
          <div className="content_category">
            <div className="content_top">
              <p>Danh mục sản phẩm</p>
              <div>
                <i
                  className={!addCate ? "bi bi-dash" : "bi bi-plus"}
                  onClick={onAddCategory}
                ></i>
              </div>
            </div>
            <div
              className="list_catepro"
              style={{ display: addCate ? "flex" : "none" }}
            >
              {dataCate123?.[0]?.children?.length > 0 &&
                dataCate123?.[0]?.children?.map((item, index) => (
                  <div key={item?._id}>
                    <div className="namecate_chil">
                      <div>
                        <p
                          style={{
                            color:
                              addCateChild.ind === index &&
                              addCateChild.visibiliti &&
                              "#f52222",
                          }}
                        >
                          <Link to={`/category/${item?._id}`}>
                            {item?.name}
                          </Link>
                        </p>
                        <div className="downcate_chil">
                          <i
                            className="bi bi-chevron-down"
                            onClick={() => {
                              onAddCategoryChild(index);
                            }}
                          ></i>
                        </div>
                      </div>
                      <div
                        className="namecate_chil_item"
                        style={{
                          display:
                            addCateChild.ind === index &&
                            addCateChild.visibiliti
                              ? "flex"
                              : "none",
                        }}
                      >
                        {item?.children?.length > 0 ? (
                          item?.children?.map((it, id) => (
                            <div key={it?._id}>
                              <span>
                                <Link to={`/category/${it?._id}`}>
                                  {it?.name}
                                </Link>
                              </span>
                            </div>
                          ))
                        ) : (
                          <div>
                            <span>--Đang cập nhật--</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        <hr />
        <div className="condition-price">
          <div>
            <p>Giá</p>
          </div>

          <Box sx={{ width: "100 %", padding: "1rem" }}>
            <Slider
              getAriaLabel={() => "Price range"}
              value={value}
              onChange={handleChange}
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
              valueLabelFormat={valuetext}
              min={0}
              max={5000000}
              step={50000}
              style={{ color: "#565252 " }}
            />
          </Box>
          <div className="price_change_condition">
            <div>
              <label htmlFor="min">Min: </label>
              <input
                type="text"
                id="min"
                readOnly
                value={formatMoney(value[0])}
              />
            </div>
            <span>-</span>
            <div>
              <label htmlFor="max">Max: </label>
              <input
                type="text"
                id="max"
                readOnly
                value={formatMoney(value[1])}
              />
            </div>
          </div>
          <div className="button-page-cate-loc">
            <button onClick={handleFilter}>Tìm kiếm</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryCondition;
