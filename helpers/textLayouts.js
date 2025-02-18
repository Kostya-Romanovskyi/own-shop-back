const formatDateTime = require("./formateDateandTime");

const createOrderReceivedText = (name) => {
  const orderReceivedText = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <p style="font-size: 16px; color: #333;">Dear ${name},</p>
    
      <p style="font-size: 16px; color: #333;">We have received your order! 🎉</p>
    
      <p style="font-size: 16px; color: #333;">Our team is now processing it. You will receive another message shortly with the estimated preparation time.</p>
    
      <p style="font-size: 16px; color: #333;">Thank you for choosing us! 🍣</p>
    
      <p style="font-size: 16px; color: #333;">Best regards,</p>
      <p style="font-size: 16px; color: #d32f2f; font-weight: bold;">OwnRestaurant</p>
    </div>
    `;

  return orderReceivedText;
};

const createApprovedOrderText = (name, time) => {
  const approvedOrderText = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
  <p style="font-size: 16px; color: #333;">Dear ${name},</p>

  <p style="font-size: 16px; color: #333;">Thank you for your order! 🎉</p>

  <p style="font-size: 16px; color: #333;">We have received it and are currently preparing it for you.</p>

  <h2 style="color: #d32f2f; text-align: center; font-size: 22px;">Your Estimated Preparation Time: ${time} minutes</h2>

  <p style="font-size: 16px; color: #333;">You will receive a notification when your order is ready for pickup.</p>

  <p style="font-size: 16px; color: #333;">If you have any questions, feel free to contact us.</p>

  <p style="font-size: 16px; color: #333;">Enjoy your meal! 🍣</p>
</div>
`;

  return approvedOrderText;
};

const createOrderReadyText = (name) => {
  const orderReadyText = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <p style="font-size: 16px; color: #333;">Dear ${name},</p>
  
      <p style="font-size: 16px; color: #333;">Your order is now ready for pickup! 🚀</p>
  
      <p style="font-size: 16px; color: #333;">Please visit our location to collect your order at your earliest convenience.</p>
  
      <h2 style="color: #d32f2f; text-align: center; font-size: 22px;">Pickup Location: Address</h2>
  
      <p style="font-size: 16px; color: #333;">If you have any questions, feel free to contact us.</p>
  
      <p style="font-size: 16px; color: #333;">Enjoy your meal! 🍣</p>
  
      <p style="font-size: 16px; color: #d32f2f; font-weight: bold;">OwnRestaurant</p>
    </div>
  `;

  return orderReadyText;
};

const createOrderCancelledText = (name, orderId) => {
  const orderCancelledText = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #fff3f3;">
    <p style="font-size: 16px; color: #333;">Dear ${name},</p>

    <p style="font-size: 16px; color: #d32f2f; font-weight: bold;">We regret to inform you that your order has been cancelled. ❌</p>

    <p style="font-size: 16px; color: #333;">If this was a mistake or you need assistance, please contact us.</p>

    <h2 style="color: #d32f2f; text-align: center; font-size: 22px;">Order Number: #${orderId}</h2>

    <p style="font-size: 16px; color: #333;">We apologize for the inconvenience and hope to serve you again in the future.</p>

    <p style="font-size: 16px; color: #333;">Best regards,</p>
    <p style="font-size: 16px; color: #d32f2f; font-weight: bold;">OwnRestaurant</p>
  </div>
`;
  return orderCancelledText;
};

// reservations

const createReceivedTableText = (name, reservation) => {
  const reservationReceivedText = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    <p style="font-size: 16px; color: #333;">Dear ${name},</p>

    <p style="font-size: 16px; color: #333;">We have received your table reservation request! 🍽️</p>

    <h2 style="color: #d32f2f; text-align: center; font-size: 22px;">Reservation Request Details</h2>

    <p style="font-size: 16px; color: #333;"><strong>Date and time:</strong> ${formatDateTime(
      reservation.start_time
    )}</p>

    <p style="font-size: 16px; color: #333;"><strong>Guests:</strong> ${
      reservation.guest_count
    } people</p>
    <p style="font-size: 16px; color: #333;"><strong>Location:</strong> Address</p>

    <p style="font-size: 16px; color: #333;">We will review your request and send you a confirmation shortly. If you have any questions, feel free to contact us.</p>

    <p style="font-size: 16px; color: #333;">Thank you for choosing us!</p>

    <p style="font-size: 16px; color: #d32f2f; font-weight: bold;">OwnRestaurant</p>
  </div>
`;

  return reservationReceivedText;
};

const createTableConfirmedText = (name, reservation) => {
  const reservationConfirmedText = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    <p style="font-size: 16px; color: #333;">Dear ${name},</p>

    <p style="font-size: 16px; color: #333;">Your table reservation has been confirmed! 🎉</p>

    <h2 style="color: #d32f2f; text-align: center; font-size: 22px;">Reservation Details</h2>

    <p style="font-size: 16px; color: #333;"><strong>Date and time:</strong> ${formatDateTime(
      reservation.start_time
    )}</p>
    <p style="font-size: 16px; color: #333;"><strong>Guests:</strong> ${
      reservation.guest_count
    } people</p>
    <p style="font-size: 16px; color: #333;"><strong>Table:</strong> ${
      reservation.table_number
    }</p>
    <p style="font-size: 16px; color: #333;"><strong>Location:</strong> Address</p>

    <p style="font-size: 16px; color: #333;">We look forward to welcoming you! If you need to make any changes, please contact us in advance.</p>

    <p style="font-size: 16px; color: #333;">Best regards,</p>
    <p style="font-size: 16px; color: #d32f2f; font-weight: bold;">OwnRestaurant</p>
  </div>
`;

  return reservationConfirmedText;
};

const createCancelledTableText = (name, reservation) => {
  const reservationCanceledText = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    <p style="font-size: 16px; color: #333;">Dear ${name},</p>

    <p style="font-size: 16px; color: #d32f2f; font-weight: bold;">We regret to inform you that your table reservation has been canceled. ❌</p>

    <h2 style="color: #d32f2f; text-align: center; font-size: 22px;">Reservation Details</h2>

    <p style="font-size: 16px; color: #333;"><strong>Date and time:</strong> ${formatDateTime(
      reservation.start_time
    )}</p>
    <p style="font-size: 16px; color: #333;"><strong>Guests:</strong> ${
      reservation.guest_count
    } people</p>

    <p style="font-size: 16px; color: #333;">If you have any questions or wish to make a new reservation, please contact us. We apologize for any inconvenience.</p>

    <p style="font-size: 16px; color: #333;">We hope to welcome you another time!</p>

    <p style="font-size: 16px; color: #d32f2f; font-weight: bold;">OwnRestaurant</p>
  </div>
`;

  return reservationCanceledText;
};
module.exports = {
  createOrderReceivedText,
  createApprovedOrderText,
  createOrderReadyText,
  createOrderCancelledText,
  createTableConfirmedText,
  createReceivedTableText,
  createCancelledTableText,
};
