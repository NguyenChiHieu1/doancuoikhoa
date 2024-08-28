const ScreenHeader = ({children}) => {
    return(
     <div className="flex items-center justify-between border-b border-gray-700 pb-5 mb-5 mt-5">
         {children}
     </div>
    )
}
export default ScreenHeader;