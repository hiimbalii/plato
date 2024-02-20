use axum::{
    http::{header, Method, StatusCode},
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use tower::{Service, ServiceBuilder, ServiceExt};
use tower_http::cors::{Any, CorsLayer};

#[tokio::main]
async fn main() {
    // initialize tracing
    tracing_subscriber::fmt::init();

    let cors = CorsLayer::new()
        // allow `GET` and `POST` when accessing the resource
        .allow_methods([Method::GET, Method::POST])
        .allow_headers([header::CONTENT_TYPE])
        // allow requests from any origin
        .allow_origin(Any);

    // build our application with a route
    let app = Router::new()
        // `GET /` goes to `root`
        .route("/", get(root))
        // `POST /users` goes to `create_user`
        .route("/ping", post(save_ping))
        .layer(cors);

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

// basic handler that responds with a static string
async fn root() -> &'static str {
    "Plato svc"
}

async fn save_ping(Json(payload): Json<Vec<Event>>) -> StatusCode {
    dbg!(payload);
    StatusCode::OK
}

#[derive(Debug, Deserialize)]
#[serde(tag = "eventName")]
enum Event {
    HTTPCall,
    DOMContentLoaded,
    #[serde(rename = "click")]
    Click,
    #[serde(rename = "type")]
    Type,
}

#[derive(Serialize)]
struct User {
    id: u64,
    username: String,
}
