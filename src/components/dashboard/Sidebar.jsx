import { Link } from "react-router-dom";
const Sidebar = () => {
    return (
      <div className={`fixed top-0 sm:left-0 w-64 h-screen bg-gray-800 z-10 transition-all`}>
        <div className="bg-white p-4 content-center">
          <div className="flex flex-col p-4 items-center">
            <img 
                src="/vite.svg" 
                alt="logo"  
                className="w-12 h-12 rounded-full"/>
            <div className=" flex flex-col justify-center">
                <p className="font-semibold">Họ và tên</p>
                <p className="text-sm text-gray-400">Chức năng</p>
            </div>
          </div>
        </div>
        <ul className="mt-4">
          <li className="px-4 cursor-pointer transition-all py-3 text-white flex items-center hover:bg-gray-600">
            <i className="bi bi-card-list mr-2 inline-block text-lg"></i>{" "}
            <Link to="/dashboard/products" className="text-base capitalize">
              products
            </Link>
          </li>
          <li className="px-4 cursor-pointer transition-all py-3 text-white flex items-center hover:bg-gray-600">
            <i className="bi bi-bag-check mr-2 inline-block text-lg"></i>{" "}
            <Link to="/dashboard/coupons" className="text-base capitalize">
              coupons
            </Link>
          </li>
          <li className="px-4 cursor-pointer transition-all py-3 text-white flex items-center hover:bg-gray-600">
            <i className="bi bi-people-fill mr-2 inline-block text-lg"></i>{" "}
            <Link to="/dashboard/brands" className="text-base capitalize">
              brands
            </Link>
          </li>
          <li className="px-4 cursor-pointer transition-all py-3 text-white flex items-center hover:bg-gray-600">
            <i className="bi bi-bar-chart mr-2 inline-block text-lg"></i>{" "}
            <Link to="/dashboard/category" className="text-base capitalize">
              categories
            </Link>
          </li>
          <li className="px-4 cursor-pointer transition-all py-3 text-white flex items-center hover:bg-gray-600">
            <i className="bi bi-people-fill mr-2 inline-block text-lg"></i>{" "}
            <Link to="#" className="text-base capitalize">
              advertisement
            </Link>
          </li>
        </ul>
      </div>
    );
  };
export default Sidebar;