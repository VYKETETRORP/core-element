<template>
  <div class="login-form">
    <div class="login-form-wrapper">
      <div class="login-form-item">
        <el-input
          ref="username"
          v-model="form.username"
          :autofocus="true"
          :size="windowSize"
          placeholder="Username"
          class="login-textbox"
          @focus="selectAll"
        >
          <template #prefix>
            <i class="el-input__icon fa fa-lock" />
          </template>
        </el-input>
      </div>
      <div class="login-form-item">
        <el-input
          ref="password"
          v-model="form.password"
          :type="passwordInputType"
          :size="windowSize"
          placeholder="Password"
          class="login-textbox"
          style="border: none"
          @focus="selectAll"
          @keyup.enter="submit"
        >
          <template #prefix>
            <i class="el-input__icon fa fa-user" />
          </template>

          <template #suffix>
            <i
              :class="'el-input__icon fa fa-' + passwordVisibilityIcon"
              style="cursor: pointer"
              @click="togglePasswordVisibility"
            />
          </template>
        </el-input>
      </div>

      <div class="login-btn-panel">
        <el-button
          :loading="loadingLogin"
          :size="windowSize"
          type="primary"
          class="login-btn"
          @click="submit"
        >
          Log in
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Msg from '/imports/ui/lib/message'
// Component
import { ElInput, ElButton, ElIcon } from 'element-plus'

export default {
  name: 'Login',
  components: {
    [ElInput.name]: ElInput,
    [ElButton.name]: ElButton,
    [ElIcon.name]: ElButton,
  },
  data() {
    return {
      windowSize: 'default',
      loadingLogin: false,
      passwordInputType: 'password',
      passwordVisibilityIcon: 'eye',
      form: {
        username: '',
        password: '',
      },
    }
  },
  computed: {
    userExpiryDay() {
      return this.$store.getters['app/userExpiryDay']
    },
  },
  created() {
    // Get init window size
    this.resizeWindow()
    // Track window size
    window.addEventListener('resize', this.resizeWindow)
  },
  unmounted() {
    // Remove window resize event
    window.removeEventListener('resize', this.resizeWindow)
  },
  methods: {
    resizeWindow() {
      if (!window) this.windowSize = 'default'

      // Cheeck screen width
      if (window.innerWidth > 1025) {
        this.windowSize = 'default'
      } else {
        this.windowSize = 'small'
      }
    },
    selectAll(event) {
      event.target.select()
    },
    togglePasswordVisibility() {
      if (this.passwordInputType === 'password') {
        this.passwordInputType = 'text'
        this.passwordVisibilityIcon = 'eye-slash'
      } else {
        this.passwordInputType = 'password'
        this.passwordVisibilityIcon = 'eye'
      }
    },
    forgetPass({ route }) {
      // console.log(route)
      this.$router.push(route)
    },
    resetNewPass({ route }) {
      // console.log(route)
      this.$router.push(route)
    },
    submit() {
      this.loadingLogin = true

      if (this.form.username && this.form.password) {
        this.$store
          .dispatch('app/login', this.form)
          .then(() => {
            // Check expiry day
            if (this.userExpiryDay <= 0) {
              this.$router.push({ name: 'Confirm' })
            } else {
              this.$router.push({ path: '/' })
            }
          })
          .catch((err) => {
            this.loadingLogin = false
            Msg.error(err.reason || err)
            // Msg.error('Username or password is incorrect')
            this.$refs.username.$el.querySelector('input').focus()
          })
      } else {
        this.loadingLogin = false
        Msg.error('Username or password is incorrect')
      }
    },
  },
}
</script>

<style
  lang="scss"
  scoped
>
// Variable
$small-screen: 'only screen and (min-width: 0px) and (max-width: 1025px)';

.login-textbox {
  :deep(.el-input__inner) {
    font-size: 15px !important;
    line-height: 15px !important;
    color: #303952 !important;
  }
}
.login-form {
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  @media #{$small-screen} {
    padding: 16px 8px;
  }

  .login-form-wrapper {
    display: flex;
    flex-flow: column wrap;

    .login-form-item {
      margin-bottom: 16px;
      @media #{$small-screen} {
        margin-bottom: 12px;
      }
    }

    .login-btn-panel {
      margin-top: 16px;
      @media #{$small-screen} {
        margin-top: 8px;
      }

      .velmld-overlay {
        .velmld-spinner {
          transform: translate(-50%, -45%);
        }
      }

      .el-button {
        width: 100%;
        min-height: 32px;
        background-color: #ff782c;
        border-color: #ff782c;
        color: #fff;
        font-size: 1em;
        line-height: 1;
        letter-spacing: 0.05em;
        font-weight: 700;
        text-transform: uppercase;

        @media #{$small-screen} {
          font-size: 0.8em;
          letter-spacing: 0.02em;
        }

        &:hover,
        &:focus,
        &:active {
          border-color: #ff8623;
          background-color: #ff8623;
        }
      }
    }
  }
}
</style>