export function formatPrice(n) {
    return "£" + n.toLocaleString("en-GB",{
        minimumFractionDigits: n % 1 ? 2 : 0,
        maximumFractionDigits: 2,
    });
}