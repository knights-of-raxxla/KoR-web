<template>
<div>
    <div class="row">
        <div class="col text-center" style="margin-top: 30px;">
            <h3>Raxxla Research Program</h3>
        </div>

    </div>
    <div class="row">
        <div class="col-md-6 offset-md-3">
            <div class="row">
                <div class="card col-xs-12 text-white bg-primary" style="margin-top: 30px; width: 100%;">
                    <div class="card-header">Login</div>
                    <div class="card-body">
                        <div class="form-group">
                            <label for="exampleInputEmail1">Email address</label>
                            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" style="">
                            </input>

                            <label>Password</label>
                            <input type="password" class="form-control">
                        </div>
                        <small>
                            <a href="/password-reset">I lost my password</a>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
    import AuthApi from '../../API/AuthApi.js';
    export default {
    }
</script>


