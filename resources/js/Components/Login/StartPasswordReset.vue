<template>
<div class="container">
    <div class="card" style="witdh: 100%;">
        <div class="card-header">
            Reset password
        </div>
        <div class="card-body">
            <div class="text-success" v-if="states.next === 'success'">
                An email has been sent to your address.
            </div>
            <div class="text-danger" v-if="states.next === 'errror'">
                Something went wrong.
            </div>
            <form class="form-group" @submit.prevent>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email"
                        v-model="form.email"
                        class="form-control"
                    />
                </div>
                <input type="submit"
                class="btn btn-success"
                v-on:click="submit"
                value="Reset my password" />
            </form>
        </div>
    </div>
</div>
</template>
<script>
    import AuthApi from '../../API/AuthApi.js';
    const authApi = new AuthApi();
    export default {
        data() {
            return {
                form: {
                    email: null
                },
                states: {
                    next: null
                }
            }
        },
        methods: {
            submit() {
                console.log('pew pew');
                return authApi.startResetPassword(this.form)
                .then(res => {
                    console.log({res});
                    this.states.next = 'success';
                }).catch(err => {
                    console.log({err});
                    this.states.next = 'errror';
                });
            }
        }
    }
</script>
