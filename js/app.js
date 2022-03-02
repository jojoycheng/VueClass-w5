// 引入產品元件
import userProductModal from './userProductModal.js';
// 解構套件物件作為變數使用
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;
// 定義驗證規則
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);
// 載入中文檔案
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
    generateMessage: localize('zh_TW'),
});

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'ejmusic';

const app = Vue.createApp({
    data() {
        return {
            loadingItem: '',
            products: [],
            product: {},
            productId: '',
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },
            cart: {},
        };
    },
    components: {
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
    },
    methods: {
        getProducts() {
            const url = `${apiUrl}/api/${apiPath}/products/all`;
            axios.get(url).then(res => {
                this.products = res.data.products;
            }).catch(err => {
                alert(err.data.message);
            });
        },
        openProductModal(id) {
            this.productId = id
            this.$refs.userProductModal.openModal()
        },
        addToCart(id, qty = 1) {
            const url = `${apiUrl}/api/${apiPath}/cart`;
            this.loadingItem = id;
            const cart = {
                product_id: id,
                qty,
            };
            this.$refs.userProductModal.hideModal();
            axios.post(url, { data: cart }).then(res => {
                alert(res.data.message);
                this.loadingItem = '';
                this.getCart();
            }).catch(err => {
                alert(err.data.message);
            });
        },
        updateCart(data) {
            this.loadingItem = data.id;
            const url = `${apiUrl}/api/${apiPath}/cart/${data.id}`;
            const cart = {
                product_id: data.product_id,
                qty: data.qty,
            };
            axios.put(url, { data: cart }).then(res => {
                alert(res.data.message);
                this.loadingItem = '';
                this.getCart();
            }).catch(err => {
                alert(err.data.message);
                this.loadingItem = '';
            });
        },
        deleteAllCarts() {
            const url = `${apiUrl}/api/${apiPath}/carts`;
            axios.delete(url).then(res => {
                alert(res.data.message);
                this.getCart();
            }).catch(err => {
                alert(err.data.message);
            });
        },
        getCart() {
            const url = `${apiUrl}/api/${apiPath}/cart`;
            axios.get(url).then(res => {
                this.cart = res.data.data;
            }).catch(err => {
                alert(err.data.message);
            });
        },
        removeCartItem(id) {
            const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
            this.loadingItem = id;
            axios.delete(url).then(res => {
                alert(res.data.message);
                this.loadingItem = '';
                this.getCart();
            }).catch(err => {
                alert(err.data.message);
            });
        },
        createOrder() {
            const url = `${apiUrl}/api/${apiPath}/order`;
            const order = this.form;
            axios.post(url, { data: order }).then(res => {
                alert(res.data.message);
                this.$refs.form.resetForm();
                this.getCart();
            }).catch(err => {
                alert(err.data.message);
            });
        },
    },
    mounted() {
        this.getProducts();
        this.getCart();
    },
})
// 元件註冊
app.component('userProductModal', userProductModal)
app.mount('#app');