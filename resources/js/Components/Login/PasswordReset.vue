<template>
    <div class="container">
        <div class="card" style="width: 100%">
            <div class="card-header">
                Reset password
            </div>

            <div class="card-body">
                <form class="form-group" @submit.prevent>
                    <div class="form-group">
                        <div class="text-danger"
                            v-if="states.success === false">
                            An error occured.
                        </div>

                        <div class="text-success"
                            v-if="states.success === true">
                            Password reset.
                        </div>


                        <label>New Password</label>
                        <input type="password"
                        class="form-control"
                        required="true"
                        v-model="form.password" />

                        <div class="text-danger"
                        v-if="form.password && form.password.length && !password_safe"
                        >
                            Your password is not safe enough.
                        </div>

                        <label>New Password Verification</label>
                        <input type="password"
                        required="true"
                        class="form-control"
                        v-model="form.password_verif"
                        />
                        <div class="text-danger"
                        v-if="form.password_verif && form.password_verif.length && !passwords_match"
                        >
                            Passwords do not match.
                        </div>
                    </div>

                    <input type="submit" class="btn btn-success"
                        v-on:click="submit"
                        value="Change my password"
                        :disabled="!can_submit"
                    >
                    </input>
                </form>
                <label
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
                    password: null,
                    password_verif: null
                },
                states: {
                    errors: [],
                    success: null
                }
            };
        },
        props :{
            token: {
                type: String,
                required: true
            }
        },
        methods: {
            submit() {
                let data = {
                    password: this.form.password,
                    token: this.token
                };
                authApi.resetPassword(data)
                .then(res => {
                    this.states.success = true;
                    window.location.href = '/signin';
                }).catch(err => {
                    this.states.success = false;
                });

            }
        },
        computed: {
            all_fields_filled() {
                let keys = [
                    'password',
                    'password_verif',
                ];
                let valid = true;
                for (let key of keys) {
                    let val = this.form[key];
                    if (!val || !val.length) {
                        valid = false;
                        let err = `please set the field ${key}`;
                        this.states.errors.push(err);
                    }
                }
                return valid;
            },
            password_safe() {
                let pwd = this.form.password || "";
                // let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
                let regex = (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/);
                let m = pwd.match(regex);
                return m && m.length > 0;
            },
            passwords_match() {
                let pwds_match = this.form.password ===
                this.form.password_verif;
                return pwds_match;
            },
            can_submit() {
                return this.all_fields_filled === true &&
                    this.passwords_match === true &&
                    this.password_safe === true;
            }
        }
    }
    </script>
