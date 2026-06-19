import React from 'react';
import { X, Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CART_ITEMS = [
  {
    id: 1,
    name: "طاولة قهوة فاخرة",
    vendor: "الزاوية الحديثة",
    price: 420,
    img: "https://images.unsplash.com/photo-1544333346-64e4fe18274b?auto=format&fit=crop&q=80&w=200",
    quantity: 1,
    attributes: "اللون: بني ريفي"
  },
  {
    id: 2,
    name: "مرآة بإطار مذهب",
    vendor: "أناقة المنزل",
    price: 340,
    img: "https://images.unsplash.com/photo-1587584160352-736021198642?auto=format&fit=crop&q=80&w=200",
    quantity: 2,
    attributes: "الحجم: 80x120 سم"
  }
];

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 bottom-0 left-0 w-full md:w-[400px] bg-white z-[70] shadow-2xl transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 text-diyar-dark">
            <ShoppingBag className="w-6 h-6" />
            <h2 className="text-xl font-bold">سلة المشتريات</h2>
            <span className="bg-diyar-brown text-white text-xs font-bold px-2 py-0.5 rounded-full">
              3
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-500 hover:text-diyar-dark"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {CART_ITEMS.map((item) => (
             <div key={item.id} className="flex gap-4 p-3 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 bg-gray-50">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=60&w=400";
                    }}
                  />
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-diyar-dark text-sm md:text-base line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-gray-400 mb-1">{item.vendor}</p>
                    </div>
                    <button className="text-gray-400 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100 md:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-2">{item.attributes}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-diyar-dark">{item.price} ر.س</span>
                    
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
                      <button className="text-gray-500 hover:text-diyar-brown p-0.5"><Minus size={14} /></button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button className="text-gray-500 hover:text-diyar-brown p-0.5"><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
             </div>
          ))}

          {/* Add more mockup for scrolling */}
           <div className="bg-diyar-cream/30 border border-diyar-cream rounded-2xl p-4 mt-6">
             <h4 className="font-bold text-sm text-diyar-dark mb-2">هل نسيت شيئاً؟</h4>
             <p className="text-xs text-gray-500 mb-3">ربما يعجبك أيضاً مجموعة الوسائد المتناسقة مع الأريكة.</p>
             <button className="text-xs font-bold text-diyar-brown bg-white px-3 py-1.5 rounded-lg border border-diyar-brown/20 hover:bg-diyar-brown hover:text-white transition">تصفح المقترحات</button>
           </div>
        </div>

        {/* Footer / Checkout */}
        <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50 pb-safe">
          <div className="flex justify-between text-sm text-gray-500 mb-3">
             <span>المجموع الفرعي</span>
             <span>1,100 ر.س</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mb-3">
             <span>ضريبة القيمة المضافة (15%)</span>
             <span>165 ر.س</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-diyar-dark mb-4 md:mb-6">
             <span>الإجمالي</span>
             <span>1,265 ر.س</span>
          </div>

          <Link 
            to="/checkout"
            onClick={onClose}
            className="w-full bg-diyar-dark text-white font-bold py-3.5 md:py-4 rounded-xl shadow-lg shadow-black/10 flex items-center justify-center gap-2 hover:bg-black transition-colors group"
          >
            إتمام الطلب
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="text-center mt-3 text-xs text-gray-400">
            الضرائب والشحن تحسب في خطوة الدفع
          </div>
        </div>
      </div>
    </>
  );
}
