/*
 * @author     Sashas IT Support <support@sashas.org>
 * @copyright  2020  Sashas IT Support Inc. (http://www.extensions.sashas.org)
 * @license     http://opensource.org/licenses/GPL-3.0  GNU General Public License, version 3 (GPL-3.0)
 */

define([
    'TheSGroup_CheckoutCart/js/view/cart-items',
    'jquery',
    'TheSGroup_CheckoutCart/js/action/update-cart',
    'Magento_Customer/js/customer-data',
    'Magento_Checkout/js/model/shipping-rate-processor/new-address',
    'Magento_Checkout/js/model/shipping-rate-registry',
    'Magento_Checkout/js/model/quote',
], function (
    Component,
    $,
    updateCartAction,
    customerData,
    defaultShippingProcessor,
    rateRegistry,
    quote
) {
    'use strict';

    let checkoutCartMergedCells = window.checkoutCartMergedCells;

    return Component.extend({
        checkoutCartMergedCells: checkoutCartMergedCells,

        mergedCells: function () {
            return this.checkoutCartMergedCells == 2 ? true : false;  //eslint-disable-line eqeqeq
        },

        emptyCart: function (eventData) {  //eslint-disable-line no-unused-vars
            let data = {'cart': {'empty_cart' : true }};
            var deferred = $.Deferred();

            updateCartAction(data, deferred);
            $.when(deferred).done(function () {
                customerData.invalidate(['cart']);
                customerData.reload(['cart'], true);
                rateRegistry.set(quote.shippingAddress().getCacheKey(), null);
                defaultShippingProcessor.getRates(quote.shippingAddress());
            });
        }
    });
});
