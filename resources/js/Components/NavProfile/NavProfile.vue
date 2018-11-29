<template>
<div>
      <div class="dropdown" v-if="!is_logged_in">
          <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
              Sign in / Sign up
          </button>
          <div class="dropdown-menu">
              <a class="dropdown-item" href="/signin">Sign in</a>
              <a class="dropdown-item" href="/signup">Sign up</a>
          </div>
      </div>
      <div class="dropdown" v-if="is_logged_in">
          <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
            CMDR {{ profile.name }}
          </button>
          <div class="dropdown-menu">
              <a class="dropdown-item" href="/profile">Profile</a>
              <a class="dropdown-item" href="#" v-on:click="signout">Sign out</a>
          </div>
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
