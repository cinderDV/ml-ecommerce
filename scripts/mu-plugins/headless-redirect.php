<?php
/**
 * Redirige la confirmación de pedido al frontend Next.js después del pago.
 * Sin esto, Webpay redirige a /pedido-recibido/ en el dominio de WC.
 */
add_filter('woocommerce_get_checkout_order_received_url', function ($url, $order) {
    // Cambiar en producción al dominio real del frontend
    $frontend = 'http://localhost:3000';
    return $frontend . '/checkout/confirmacion?order_id=' . $order->get_id();
}, 10, 2);
