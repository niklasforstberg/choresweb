import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { createHousehold, joinHousehold } from "../api/household";

export default function NoHousehold() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const onSuccess = () => queryClient.invalidateQueries();
  const create = useMutation({ mutationFn: createHousehold, onSuccess });
  const join = useMutation({ mutationFn: joinHousehold, onSuccess });

  return (
    <div className="stack">
      <h1>{t("noHousehold.title")}</h1>
      <p className="muted">{t("noHousehold.intro")}</p>
      <div className="cards">
        <form className="card stack" onSubmit={e => { e.preventDefault(); create.mutate(name); }}>
          <h2>{t("noHousehold.createTitle")}</h2>
          <label>
            {t("noHousehold.name")}
            <input value={name} onChange={e => setName(e.target.value)} required />
          </label>
          {create.error && <p className="error">{create.error.message}</p>}
          <button className="btn-primary" type="submit" disabled={create.isPending}>{t("noHousehold.create")}</button>
        </form>
        <form className="card stack" onSubmit={e => { e.preventDefault(); join.mutate(code); }}>
          <h2>{t("noHousehold.joinTitle")}</h2>
          <label>
            {t("noHousehold.code")}
            <input className="code-input" value={code} onChange={e => setCode(e.target.value)} required />
          </label>
          {join.error && <p className="error">{join.error.message}</p>}
          <button className="btn-primary" type="submit" disabled={join.isPending}>{t("noHousehold.join")}</button>
        </form>
      </div>
    </div>
  );
}
