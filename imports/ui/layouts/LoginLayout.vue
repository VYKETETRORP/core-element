<template>
  <el-container class="login-container">
    <el-main>
      <div class="login-container">
        <div class="login-content">
          <div class="login-company-panel">
            <img src="/images/logo.png" class="login-company-logo" />
            <h1 class="login-company-name">Rabbit Technology</h1>
            <p>Login to your account</p>
          </div>

          <router-view />
        </div>
      </div>

      <div class="footer">
        <div>
          {{ copyright }}
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import moment from "moment";
import release from "../release";
import { ElContainer, ElMain, ElRow } from "element-plus";

const copyright = `© 2014-${moment().format(
  "YYYY"
)} Rabbit Technology (V ${release})`;
</script>
<style lang="scss" scoped>
// Variable
$small-screen: "only screen and (min-width: 0px) and (max-width: 1025px)";
$small-screen--height: "only screen and (min-height: 0px) and (max-height: 505px)";

// Media screen width
.login-container {
  height: 100vh;
  background: url("/images/bg.svg") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  color: #303952;
  .el-main {
    padding: 0;

    .login-container {
      width: 100vw;
      height: calc(100vh - 41px);
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      padding: 8px 8px;
      box-sizing: border-box;
      overflow: auto;
      @media #{$small-screen--height} {
        height: 100vh;
      }

      .login-content {
        align-self: center; // make element not fill height flex container
        width: 400px;
        box-sizing: border-box;
        box-shadow: 0 1px 10px 1px rgba(255, 255, 255, 0.25);
        padding: 40px 16px 40px 16px;
        margin: auto;
        border-radius: 4px;
        backdrop-filter: blur(0px) saturate(1200%);
        background-color: rgba(255, 255, 255, 0.65);
        border: 1px solid rgba(209, 213, 219, 0.15);

        @media #{$small-screen} {
          width: 350px;
          padding: 35px 12px 35px 12px;
        }

        .login-company-panel {
          width: 100%;
          display: flex;
          flex-flow: column nowrap;
          align-items: center;
          margin-bottom: 24px;

          .login-company-logo {
            width: 75px;
            margin-bottom: 16px;

            @media #{$small-screen} {
              width: 65px;
            }
          }

          .login-company-name {
            text-align: center;
            margin: 0;
            padding: 0;
            margin-bottom: 16px;
            font-size: 1.95em;
            line-height: 1;
            font-weight: 700;

            @media #{$small-screen} {
              margin-bottom: 8px;
              font-size: 1.65em;
            }
          }

          p {
            margin: 0;
            font-size: 1.3em;
            font-weight: 500;
            line-height: 1;

            @media #{$small-screen} {
              font-size: 1.15em;
            }
          }
        }
      }
    }

    .footer {
      position: absolute;
      width: 100%;
      height: 40px;
      line-height: 40px; // make text vertically center
      bottom: 0;
      font-size: 0.8em;
      text-align: center;
      color: #f7fafd;
      text-shadow: 0 0 2px #fff;
      @media #{$small-screen--height} {
        display: none;
      }
    }
  }
}
</style>
