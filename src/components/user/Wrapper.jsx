import Header from "./Header";
import Footer from "./Footer";
import "../../screens/user/style_user_css/style/header.css";
import "../../screens/user/style_user_css/style/footer.css";

const Wrapper = ({ children, onFooter = true }) => {
  return (
    <>
      <Header />
      {children}
      {onFooter && <Footer />}
    </>
  );
};
export default Wrapper;
