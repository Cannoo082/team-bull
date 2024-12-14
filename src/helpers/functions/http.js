import * as endpoints from "../constants/endpoints";
import { error as errMsg} from "@/helpers/constants/messages";
function optionsFactory({ method = "POST", mode = "cors", body = {} }) {
  return {
    method,
    mode,
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

async function sendRequest(endpoint, options = {}, info = true) {
  let response, data;

  try {
    response = await fetch(endpoint, options);
    data = await response.json();
  } catch (error) {
    console.log(error.message);
    return;
  }

  if (!response.ok) {
    console.log(`failed to fetch, status code: ${response.status}`);

    if (info) {
      return {
        error: true,
        status: response.status,
        message: data?.message || errMsg.default,
      };
    }
    return;
  }

  return data;
}

export async function sendRequestLogin(email, password) {
  const endpoint = endpoints.login;
  const options = optionsFactory({
    body: {
      email,
      password,
    },
  });

  return await sendRequest(endpoint, options);
}
