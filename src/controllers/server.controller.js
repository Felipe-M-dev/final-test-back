const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

const { db } = require("../config/config")

const pool = new Pool({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database,
    allowExitOnIdle: true,
});

const registrarUsuario = async (usuario) => {
    let { email, password, rol_id } = usuario;
    const passwordEncriptada = bcrypt.hashSync(password);
    password = passwordEncriptada;
    const values = [email, passwordEncriptada, rol_id];
    const consulta = "INSERT INTO users values (DEFAULT, $1, $2, $3)";
    await pool.query(consulta, values);
};

const actualizaUsuario = async (usuario, id) => {
    let { email, password, rol_id } = usuario;
    const passwordEncriptada = bcrypt.hashSync(password);
    password = passwordEncriptada;
    const values = [email, password, rol_id, id];
    const consulta =
        "UPDATE users SET email = $1, password = $2, rol_id = $3 WHERE id = $4";
    await pool.query(consulta, values);
};

const obtenerDatosDeUsuario = async (email) => {
    const values = [email];
    const consulta = "SELECT * FROM users WHERE email = $1";

    const {
        rows: [usuario],
        rowCount,
    } = await pool.query(consulta, values);

    if (!rowCount) {
        throw {
            code: 404,
            message: "No se encontró ningún usuario con este email",
        };
    }

    delete usuario.password;
    return usuario;
};

const verificarCredenciales = async (email, password) => {
    const values = [email];
    const consulta = "SELECT * FROM users WHERE email = $1";

    const {
        rows: [usuario],
        rowCount,
    } = await pool.query(consulta, values);

    if (!rowCount)
        throw {
            code: 404,
            message: "No se encontró ningún usuario con estas credenciales",
        };

    const passwordEncriptada = usuario?.password;
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);

    if (!passwordEsCorrecta)
        throw { code: 401, message: "Contraseña incorrecta" };
};

const obtenerServers = async () => {
    const consulta = "SELECT * FROM servers";
    const { rows: servers } = await pool.query(consulta);
    return servers;
};

const registrarServer = async (server) => {
    const { hostname, ip, user_so, pass_so, ram, hdd, cpu, bill_client, environment, state, owner, name_so, admin, client, monitoring, db, engine_db, user_db, pass_db, description } = server;
    const values = [hostname, ip, user_so, pass_so, ram, hdd, cpu, bill_client, environment, state, owner, name_so, admin, client, monitoring, db, engine_db, user_db, pass_db, description];
    const consulta = "INSERT INTO servers VALUES ( DEFAULT , $1, $2, $3, $4, $5, $6, $7, current_timestamp, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20);";
    await pool.query(consulta, values);
};

const actualizaServer = async (server, id) => {
    let { hostname, ip, user_so, pass_so, ram, hdd, cpu, bill_client, environment, state, owner, name_so, admin, client, monitoring, db, engine_db, user_db, pass_db, description } = server;
    const values = [hostname, ip, user_so, pass_so, ram, hdd, cpu, bill_client, environment, state, owner, name_so, admin, client, monitoring, db, engine_db, user_db, pass_db, description, id];
    const consulta =
        "UPDATE servers SET hostname = $1, ip = $2, user_so = $3, pass_so = $4, ram = $5, hdd = $6, cpu = $7, bill_client = $8, environment = $9, state = $10, owner = $11, name_so = $12, admin = $13, client = $14, monitoring = $15, db = $16, engine_db = $17, user_db = $18, pass_db = $19, description = $20 WHERE id = $21";
    await pool.query(consulta, values);
};

const eliminarServer = async (id) => {
    const consulta = `DELETE FROM servers WHERE id=${id}`;
    const { rows: servers } = await pool.query(consulta);
    return servers;
};

module.exports = {
    registrarUsuario,
    verificarCredenciales,
    obtenerDatosDeUsuario,
    actualizaUsuario,
    obtenerServers,
    registrarServer,
    actualizaServer,
    eliminarServer,
};
