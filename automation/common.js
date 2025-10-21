import baseConfig from "./config";

export function StartApplication() {
  const workflowId = crypto.randomUUID();

  const payload = {
    id: workflowId,
    name: "dp-ndf-v0_3_0",
  };
  const start = fetch(`${baseConfig.lgs_base_url}/application/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return { start, workflowId };
}

export const generateLicensePlate = () => {
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomLetters(min, max) {
    const length = randomInt(min, max);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from({ length }, () => chars[randomInt(0, 25)]).join("");
  }

  const part1 = randomLetters(1, 2);
  const part2 = randomInt(1, 9999).toString();
  const part3 = randomLetters(1, 3);

  return `${part1}${part2}${part3}`;
};

export const cleansedName = (str) => str.replace(/[^A-Za-z ]+/g, "");
