import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getMe } from "../api/users";

export default function Home() {
  const { t } = useTranslation();
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: getMe });

  if (!me) return null;

  return <h1>{t("home.greeting", { name: me.name ?? me.email })}</h1>;
}
