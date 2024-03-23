import toast from "react-hot-toast";

const decodeBase64 = (str: string): string => {
  return Buffer.from(str, "base64").toString();
};

const decodeJwtPayload = (token: string): any => {
  const base64Payload = token.split(".")[1];
  const payload = decodeBase64(base64Payload);
  return JSON.parse(payload);
};

export const getJwtExp = (token: string): number | undefined => {
  const payload = decodeJwtPayload(token);
  return payload.exp;
};

export const jwtHandler = async (token: string) => {
  if (!token) {
    return { valid: false, expired: false, payload: null };
  }
  try {
    const exp = getJwtExp(token);

    if (!exp) {
      return { valid: false, expired: false, payload: null };
    }

    const now = Math.floor(Date.now() / 1000);
    // chek if the token is expired
    if (exp < now) {
      return { valid: false, expired: true, payload: null };
    }

    const payload = decodeJwtPayload(token);

    return { valid: true, expired: false, payload };
  } catch (error: any) {
    if (error.code === "ERR_JWT_EXPIRED") {
      return { valid: false, expired: true, payload: null };
    } else {
      return { valid: false, expired: false, payload: null };
    }
  }
};

export async function refreshTokenJWT() {
  const url = "https://secureservices.redremax.com/v1/api/login";
  const data = {
    user: {
      // get username from env
      username: process.env.NEXT_PUBLIC_REMAX_USERNAME,
      // get password from env
      password: process.env.NEXT_PUBLIC_REMAX_PASSWORD,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("No se pudo refrescar el token");
    }

    const responseBody = await response.json();
    const idToken = responseBody.id_token;

    console.log("Token refrescado:", idToken);
    localStorage.setItem("remax-token", idToken);
    return idToken;
  } catch (error) {
    toast.error("Error al refrescar el token");
    console.error("Error al refrescar el token:", error);
    throw error;
  }
}
