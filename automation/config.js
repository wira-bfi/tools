const baseConfig = {
  lgs_base_url: "http://127.0.0.1:8081",
  lts_base_url: "http://127.0.0.1:8082",
  mq_publish_url:
    "http://127.0.0.1:15672/api/exchanges/%2F/x.scheduling.appointments.work/publish",
  mq_user: "guest",
  mq_password: "guest",

  arango_db_name: "lts",
};

export default baseConfig;
