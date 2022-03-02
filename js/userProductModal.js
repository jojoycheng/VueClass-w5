export default {
    template: '#userProductModal',
    props: ['id'],
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'ejmusic',
            modal: '',
            qty: 1,
            product: {},
        };
    },
    watch: {
        id() {
            this.getProduct()
        }
    },
    emit:['add-to-cart'],
    methods: {
        openModal() {
            this.modal.show();
        },
        hideModal() {
            this.modal.hide();
        },
        getProduct() {
            const url = `${this.apiUrl}/api/${this.apiPath}/product/${this.id}`;
            axios.get(url).then(res => {
                this.product = res.data.product;
            }).catch(err => {
                alert(err.data.message);
            });
        },
    },
    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.modal, {
            keyboard: false,
            backdrop: 'static'
        });
    },
}