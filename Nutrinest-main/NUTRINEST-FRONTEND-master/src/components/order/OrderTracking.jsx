import React from "react";
import { Package, Truck, CheckCircle, Clock, XCircle, Bike } from "lucide-react";

const OrderTracking = ({ status }) => {
  const statusOrder = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"];
  const currentIndex = statusOrder.indexOf(status);

  const steps = [
    { key: "Order Placed", icon: Package, label: "Order Placed" },
    { key: "Processing", icon: Clock, label: "Processing" },
    { key: "Shipped", icon: Truck, label: "Shipped" },
    { key: "Out for Delivery", icon: Bike, label: "Out for Delivery" },
    { key: "Delivered", icon: CheckCircle, label: "Delivered" },
  ];

  const getStatusColor = (stepIndex) => {
    if (status === "Cancelled") return "text-red-500";
    if (stepIndex <= currentIndex) return "text-green-600";
    return "text-gray-300";
  };

  const getBgColor = (stepIndex) => {
    if (status === "Cancelled") return "bg-red-100";
    if (stepIndex <= currentIndex) return "bg-green-100";
    return "bg-gray-100";
  };

  const getLineColor = (stepIndex) => {
    if (status === "Cancelled") return "bg-red-300";
    if (stepIndex < currentIndex) return "bg-green-500";
    return "bg-gray-300";
  };

  if (status === "Cancelled") {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center gap-3 text-red-600">
          <XCircle className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">Order Cancelled</h3>
            <p className="text-sm text-red-500">This order has been cancelled</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Order Status</h3>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
          <div 
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step.key} className="flex flex-col items-center gap-2">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${getBgColor(index)} ${getStatusColor(index)}
                  transition-all duration-300
                  ${isCurrent ? 'ring-4 ring-green-200 scale-110' : ''}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className={`text-xs font-medium ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-[10px] text-green-600 font-bold mt-1">
                      Current
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Status Badge */}
      <div className="mt-8 flex items-center justify-center">
        <span className={`
          px-4 py-2 rounded-full text-sm font-bold
          ${status === "Delivered" ? "bg-green-100 text-green-700" :
            status === "Shipped" ? "bg-blue-100 text-blue-700" :
            status === "Out for Delivery" ? "bg-purple-100 text-purple-700" :
            status === "Processing" ? "bg-yellow-100 text-yellow-700" :
            "bg-gray-100 text-gray-700"}
        `}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default OrderTracking;
