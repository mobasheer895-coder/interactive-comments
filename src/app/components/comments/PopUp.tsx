interface Props {
  type: 'logout' | 'delete';
  onConfirm?: () => void;
  onClose?: () => void;
}
interface PopupContent {
    title: string;
    btnCancel: string;
    btnConfirm: string;
}

const popupSettings: Record<'logout' | 'delete', PopupContent> = {
    logout: {
        title: "Are you sure you want to logout from DashStack?",
        btnCancel: "No",
        btnConfirm: "Yes",
    },
    delete: {
        title: "Are you sure you want to delete this product?",
        btnCancel: "No",
        btnConfirm: "Yes",
    },
};

const Popup = ({ type, onConfirm, onClose }: Props) => {
    
const content = popupSettings[type];
console.log("Popup rendered:", type);
    return (
        <div className="p-4 fixed z-20 h-screen w-screen top-0 flex justify-center items-center bg-mist-900/30 max-md:p-10">
        <div className="bg-white p-13 rounded-3xl text-center flex flex-col justify-center  dark:bg-gray-800 max-sm:p-5
        max-md:p-10
        ">
            <h1 className="mb-10 text-3xl max-sm:text-lg max-sm:font-medium">{content.title}</h1>
        <div className="flex justify-around max-sm:gap-7">
            <button 
            onClick={onClose}
            className="hover:border-2  bg-gray-400/50 px-13 py-4 rounded-2xl cursor-pointer
            max-sm:px-8
            
          hover:bg-gray-600 transition-all hover:shadow-2xl hover:shadow-gray-400/60 hover:-translate-y-1.5 dark:hover:border-gray-100">{content.btnCancel}</button>
        <button 
        onClick={onConfirm}
        className="max-sm:px-8 bg-red-700/90 px-13 py-4 rounded-2xl cursor-pointer hover:bg-red-600 transition-all hover:shadow-xl hover:shadow-red-700/40 hover:-translate-y-1.5 hover:border-2 dark:hover:border-gray-100 dark:hover:shadow-mauve-600 dark:hover:shadow-2xl">{content.btnConfirm}</button>
        </div>
        </div>
        </div>
    )
}

export default Popup
