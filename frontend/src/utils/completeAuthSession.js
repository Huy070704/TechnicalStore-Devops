import { authService, getAdminHomePath, getRoleName, } from '@/services/authService';
import { formatDateTime } from '@/utils/dateFormatter';
import { guestCartService } from '@/services/guestCartService';
import { cartService } from '@/services/cartService';
import { wishlistService } from '@/services/wishlistService';
/** Hoàn tất đăng nhập sau khi có accessToken (email hoặc Google). */
export const completeAuthSession = async (accessToken, login, navigate, welcomeFallback = 'Chào mừng bạn trở lại!', rememberMe) => {
    // Persist token to storage first so the axios interceptor picks it up
    // for subsequent API calls (mergeGuestLines, getUserProfile).
    // Do NOT call login() yet — we don't have the real user profile.
    authService.persistSession({ email: '', role: 'customer' }, accessToken, rememberMe);
    try {
        const guestCart = guestCartService.getCart();
        if (guestCart.items.length > 0) {
            try {
                await cartService.mergeGuestLines(guestCart.items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })));
                guestCartService.clearCart();
            }
            catch (mergeErr) {
                console.error('Guest cart merge failed:', mergeErr);
            }
        }
        // Gộp wishlist khách (localStorage) lên tài khoản, rồi dùng danh sách server
        try {
            await wishlistService.mergeOnLogin();
        }
        catch (wishlistErr) {
            console.error('Wishlist merge failed:', wishlistErr);
        }
        const profile = await authService.getUserProfile();
        // Only now call login() with the real profile — one single, correct auth state.
        login(profile, accessToken, rememberMe);
        const adminPath = getAdminHomePath(getRoleName(profile));
        const roleLabel = getRoleName(profile);
        if (adminPath) {
            navigate(adminPath, {
                state: {
                    welcomeMessage: `Chào mừng ${roleLabel} trở lại!`,
                    loginTime: formatDateTime(new Date()),
                },
            });
        }
        else {
            navigate('/', {
                state: {
                    welcomeMessage: welcomeFallback,
                    loginTime: formatDateTime(new Date()),
                },
            });
        }
    }
    catch {
        navigate('/', { state: { welcomeMessage: welcomeFallback } });
    }
};
