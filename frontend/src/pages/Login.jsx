import Form from "../components/Form";
import { Auth } from "@supabase/auth-ui-react";
import {
  // Import predefined theme
  ThemeSupa,
} from "@supabase/auth-ui-shared";
import supabase from "../config/supabaseClient";

function Login() {
  return <Form method="login" />;
}

export default Login;
