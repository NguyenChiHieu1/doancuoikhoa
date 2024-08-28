import React, { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import "./style_user_css/style/pageCategory.css";
import CategoryCondition from "../../components/user/CategoryCondition";
import CategoryListProduct from "../../components/user/CategoryListProduct";
import Wrapper from "../../components/user/Wrapper";
import {
  useGetProductOfCategoryQuery,
  useGetProductsQuery,
} from "../../store/service/productService";

const PageCategoryProduct = () => {
  const { cid, page = 1 } = useParams();
  const [value, setValue] = useState("");
  const [minMax, setMinMax] = useState([0, 5000000]);

  const {
    data: dataCate,
    isLoading: loadingCate,
    refetch: refetchProOfCate,
  } = useGetProductOfCategoryQuery(
    {
      page: page,
      limit: 8,
      category: cid,
      ...(minMax[0] !== 0 && { "money[gt]": minMax[0] }),
      ...(minMax[1] !== 5000000 && { "money[lt]": minMax[1] }),
      ...(value && { sort: value }),
    },
    { skip: !cid }
  );

  const {
    data: dataGetAll,
    isLoading: loadingGetAll,
    refetch: refetchAllproduct,
  } = useGetProductsQuery(
    {
      page: page,
      limit: 8,
      ...(minMax[0] !== 0 && { "money[gt]": minMax[0] }),
      ...(minMax[1] !== 5000000 && { "money[lt]": minMax[1] }),
      ...(value && { sort: value }),
    },
    { skip: cid }
  );

  const dataCateName = useMemo(() => {
    if (!dataCate) return { level1: "", level2: "", level3: "" };
    // else {
    //   refetchProOfCate();
    // }
    return {
      level1: dataCate?.category?.level1 || "",
      level2: dataCate?.category?.level2 || "",
      level3: dataCate?.category?.level3 || "",
    };
  }, [dataCate]);

  return (
    <Wrapper>
      <div className="page_cateproduct">
        {/* <div className="page_cateproduct_breadcrumb">
          <Breadcrumb
            level1={dataCate?.category?.level1}
            level2={dataCate?.category?.level2}
            level3={dataCate?.category?.level3}
          />
        </div> */}
        <div className="page_cateproduct_content">
          <CategoryCondition
            setMinMax={(m) => {
              setMinMax(m);
            }}
            queryCate={dataCateName}
          />
          <CategoryListProduct
            data={dataGetAll?.data || dataCate?.data}
            page={page}
            cid={cid || ""}
            countsProduct={dataGetAll?.counts || dataCate?.counts}
            setValue={(e) => setValue(e)}
            isLoading={loadingGetAll || loadingCate}
            breadcrumbItems={dataCateName}
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default PageCategoryProduct;
