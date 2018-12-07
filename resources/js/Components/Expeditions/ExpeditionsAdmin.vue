<template>
<div class="container">
    <div class="card text-center" style="margin-top: 30px;" v-show="is_logged_in">
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
    const session = SessionStore.getInstance();
    export default {
        data() {
            return {
                can: {
                    show: false
                }
            }
        },
        mounted() {
        },
        methods: {
            goToExpeditionsCreate() {
                window.location.hef = '/expeditions/create';
            }
        },
        computed: {
            is_logged_in() {
                return session && session.getStore().id > 0;
            }
        }
    }
</script>
