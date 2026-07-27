const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const statusMessages = {
    "Order Placed": {
        subject: "Your NutriNest order has been placed",
        emoji: "📦"
    },
    "Processing": {
        subject: "Your NutriNest order is being processed",
        emoji: "⚙️"
    },
    "Shipped": {
        subject: "Your NutriNest order has been shipped 🚚",
        emoji: "🚚"
    },
    "Out for Delivery": {
        subject: "Your order is out for delivery",
        emoji: "🚴"
    },
    "Delivered": {
        subject: "Your order has been delivered 🎉",
        emoji: "🎉"
    },
    "Cancelled": {
        subject: "Your order has been cancelled",
        emoji: "❌"
    }
};

const statusOrder = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"];

const getOrderStatusHTML = (currentStatus) => {
    const currentIndex = statusOrder.indexOf(currentStatus);
    
    let html = '<div style="margin: 20px 0;">';
    
    statusOrder.forEach((status, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const icon = isCompleted ? "✅" : "⬜";
        const color = isCompleted ? "#10B981" : "#D1D5DB";
        
        html += `
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 18px; margin-right: 10px;">${icon}</span>
                <span style="color: ${color}; font-weight: ${isCurrent ? 'bold' : 'normal'};">
                    ${status}
                </span>
                ${isCurrent ? '<span style="margin-left: 8px; color: #10B981; font-size: 12px;">← Current</span>' : ''}
            </div>
        `;
    });
    
    html += '</div>';
    return html;
};

const sendOrderStatusEmail = async (email, orderData) => {
    const { orderId, customerName, totalAmount, currentStatus, items } = orderData;
    const statusInfo = statusMessages[currentStatus] || { subject: "Order Status Updated", emoji: "📋" };
    
    let itemsHtml = "";
    if (items && Array.isArray(items) && items.length > 0) {
        itemsHtml = `
            <div style="background: #FFFBEB; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #FDE68A;">
                <h3 style="margin: 0 0 10px 0; color: #B45309; font-size: 16px;">Items Ordered</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 1px solid #FDE68A; text-align: left; font-size: 13px; color: #92400E;">
                            <th style="padding: 6px 0;">Item Name</th>
                            <th style="padding: 6px 0; text-align: center;">Qty</th>
                            <th style="padding: 6px 0; text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        items.forEach(item => {
            const productName = item.product?.name || "Product";
            const qty = item.quantity || 1;
            const price = item.priceAtPurchase || 0;
            itemsHtml += `
                <tr style="font-size: 14px; color: #78350F; border-bottom: 1px dashed #FEF3C7;">
                    <td style="padding: 8px 0;">${productName}</td>
                    <td style="padding: 8px 0; text-align: center;">${qty}</td>
                    <td style="padding: 8px 0; text-align: right;">₹${price * qty}</td>
                </tr>
            `;
        });
        itemsHtml += `
                    </tbody>
                </table>
            </div>
        `;
    }
    
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Status Update</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">NutriNest</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Healthy Living, Happy Life</p>
                </div>
                
                <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                    <p style="font-size: 18px; margin-bottom: 20px;">Hello ${customerName},</p>
                    
                    <p style="margin-bottom: 20px;">Your order status has been updated.</p>
                    
                    <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h2 style="margin: 0 0 15px 0; color: #1F2937; font-size: 20px;">
                            ${statusInfo.emoji} Current Status: ${currentStatus}
                        </h2>
                        
                        ${getOrderStatusHTML(currentStatus)}
                    </div>
                    
                    ${itemsHtml}
                    
                    <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="margin: 0 0 10px 0; color: #1E40AF; font-size: 16px;">Order Details</h3>
                        <p style="margin: 5px 0;"><strong>Order ID:</strong> #${orderId}</p>
                        <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${totalAmount}</p>
                    </div>
                    
                    <p style="margin-bottom: 20px;">Thank you for shopping with NutriNest.</p>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/my-orders" 
                           style="display: inline-block; background: #10B981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                            View Order Details
                        </a>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px; color: #6B7280; font-size: 12px;">
                    <p>This is an automated email. Please do not reply.</p>
                    <p>&copy; ${new Date().getFullYear()} NutriNest. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    await transporter.sendMail({
        from: `"NutriNest" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: statusInfo.subject,
        html: html,
    });
};

module.exports = { sendOrderStatusEmail };
