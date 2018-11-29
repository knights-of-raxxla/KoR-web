<template>
    <div>
        <div class="container" v-show="states.ready">
            <div class="row">
                <div class="card" style="width: 100%">
                    <div class="card-header">
                        Signup
                    </div>
                    <div class="card-body">
                        <div class="form-group" :class="{'has-danger': !form_valid}">
                            <label>Commander Name</label>
                            <input type="text"
                            class="form-control"
                            placeholder="Han Solo"
                            v-model="form.name"
                            />

                            <div v-if="form.name && form.name.length && !name_valid"
                            class="text-danger">
                                Your commander name is invalid, it must contain at least 4 characters.
                            </div>

                            <label>Main platform</label>
                            <select v-model="form.platform" class="form-control">
                                <option disabled value="">Choose</option>
                                <option value="pc">PC</option>
                                <option value="ps4">PS4</option>
                                <option value="xbox_one">Xbox One</option>
                            </select>

                            <div v-if="name_valid && !valid_platform"
                            class="text-danger">
                                Please select your main gaming platform.
                            </div>



                            <label>Email</label>
                            <input type="email"
                            class="form-control"
                            placeholder="han.solo@galacticrebellion.com"
                            v-model="form.email"
                            />
                            <div v-if="form.email && form.email.length && !valid_email"
                                class="text-danger"
                            >
                                Invalid email address.
                            </div>

                            <label>Password</label>
                            <input
                            type="password" class="form-control"
                            v-model="form.password"
                            />
                            <div v-if="form.password && form.password.length && !password_safe"
                                class="text-danger"
                            >
                                Your password is not safe enough.
                            </div>

                            <label>Password Verification</label>
                            <input type="password" class="form-control"
                                v-model="form.password_verif"
                            />
                          <div class="text-danger" v-if="!passwords_match">Passwords do not match.</div>

                          <label>
                            <input
                            type="checkbox"
                            v-model="form.conditions"
                            />
                            I hereby accept the <a href="/tos"> terms of service</a>
                          </label>

                        </div>

                        <div class="col-xs-12">
                            <button class="btn btn-success" v-on:click="submit" :disabled="!form_valid">
                                Create account
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AuthApi from '../../API/AuthApi.js';
let authApi = new AuthApi();
export default {
    data() {
        return {
            a: [1, 2],
            form: {
                email: null,
                password: null,
                password_verif: null,
                name: null,
                platform: '',
                conditions: false
            },
            states: {
                ready: false,
                errors: []
            }
        }
    },
    mounted() {
        this.states.ready = true;
    },
    methods: {
        submit() {
            authApi.createUser(this.form)
                .then(data => {
                    console.log(data);
                    window.location.href = '/signin';
                }).catch(err => {
                    console.log({err});
                });
        }
    },
    computed: {
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
        valid_email() {
            let email = this.form.email || "";
            let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let m = email.match(regex);
            return m && m.length > 0;

        },
        all_fields_filled() {
            let keys = [
                'email',
                'password',
                'password_verif',
                'name',
                'platform'
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
        name_valid() {
            let name = this.form.name;
            return name && name.length > 3;
        },
        valid_platform() {
            return this.form.platform !== '';
        },
        form_valid() {
            return this.all_fields_filled === true &&
            this.valid_email === true &&
            this.passwords_match === true &&
            this.password_safe === true &&
            this.name_valid === true &&
            this.valid_platform === true &&
            this.form.conditions === true;
        }
    }
}
</script>
