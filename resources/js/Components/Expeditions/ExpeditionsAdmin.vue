<template>
<div class="container">
    <div class="card text-center" style="margin-top: 30px;">
        <div class="card-body">
                <a href="/expeditions/create">
                    <button class="btn btn-primary">
                        + Create expedition
                    </button>
                </a>
        </div>
    </div>
</div>
</template>
<script>
    import SessionStore from '../../Framework/SessionStore.js';
    export default {
        data() {
            return {
                can: {
                    show: false
                }
            }
        },
        mounted() {
            let session  = SessionStore.getInstance();
            let data = session.getStore();
        },
        methods: {
            goToExpeditionsCreate() {
                window.location.hef = '/expeditions/create';
            }
        }
    }
</script>
