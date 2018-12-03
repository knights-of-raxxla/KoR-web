<template>
<div>
    <div class="collapse navbar-collapse">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item" v-if="is_logged_in">
                <a class="nav-link" href="/user/logs/upload">
                    <i class="icon ion-md-cloud-upload"></i>
                        Upload your logs
                    </a>
            </li>
            <li v-if="!is_logged_in">
              <div class="dropdown" style="margin-left: 15px; font-size: 0.9em; margin-top: 2px;">
                  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                      Sign in / Sign up
                  </button>
                  <div class="dropdown-menu">
                      <a class="dropdown-item" href="/signin">Sign in</a>
                      <a class="dropdown-item" href="/signup">Sign up</a>
                  </div>
              </div>
            </li>


            <li v-if="is_logged_in" style="margin-top: 7px; margin-left: 15px;">
                <div class="dropdown pull-right">
                    <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                        <i class="icon ion-md-person"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-right">
                        <a class="dropdown-item" href="/profile">Profile</a>
                        <a class="dropdown-item" href="#" v-on:click="signout">Sign out</a>
                    </div>
                </div>
            </li>

        </ul>
    </div>


</div>
</template>
<script>
    import SessionStore from '../../Framework/SessionStore.js';
    import EventBusFactory from '../../Framework/EventBusFactory.js';
    export default {
        data() {
            return {
                profile: {
                    name: null,
                },
                is_logged_in: false
            }
        },
        mounted() {
            let session = SessionStore.getInstance();
            let store = session.getStore();
            if (Object.keys(store).length) {
                this.is_logged_in = true;
                this.profile.name = store.name;
            }
            this.eventBus = EventBusFactory.getInstance()
                .get('session');
        },
        methods: {
            signout() {
                this.eventBus.emit('sign out');
                // caught by Gatekeeper._onSignOut
            }
        }
    }
</script>
