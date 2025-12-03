const Expert = require('../models/expert.model');
const {
    validationResult
} = require('express-validator');
const ExpertMessages = require("../messages/expert.messages");

exports.get = async (req, res) => {
    try {
       
        const experts = await Expert.find(req.query).exec(); 

        let message = ExpertMessages.success.s2;

        if (experts.length === 0) {
            message = ExpertMessages.success.s5; 
        }

        message.body = experts;
        return res.status(message.http).send(message);

    } catch (error) {
       
        console.error("Erro ao buscar experts:", error);
        
        // Define uma mensagem de erro 500
        const errorMessage = {
            http: 500,
            code: "InternalError",
            message: "Ocorreu um erro interno no servidor ao buscar os experts."
        };
        
        return res.status(errorMessage.http).send(errorMessage);
    }
};


exports.create = async (req, res) => {
    // 1. Validação Express-Validator (OK)
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        // Cria e salva o novo Expert de forma assíncrona
        const newExpert = new Expert({
            nome: req.body.nome,
            especialidade: req.body.especialidade,
            tituloacademico: req.body.tituloacademico,
            biografia: req.body.biografia,
            urlfoto: req.body.urlfoto
        });
        
        const expert = await newExpert.save(); // Awaits a promessa de save

        // 2. Lógica de Sucesso (201 Created)
        let message = ExpertMessages.success.s0;
        message.body = expert;
        return res.header("location", "/experts/" + expert._id).status(message.http).send(message);
        
    } catch (error) {
        // 3. Tratamento Robusto de Erros (Mongoose Validation/Database Errors)
        
        // Verifica se é um erro de validação Mongoose (ex: Enum inválido)
        if (error.name === 'ValidationError') {
            // Retorna 400 Bad Request para o cliente
            const validationErrorMessage = {
                http: 400,
                code: "ValidationError",
                message: "Falha na validação dos dados de Expert. Verifique os campos.",
                details: error.message // Opcional: Para debugar no cliente
            };
            return res.status(validationErrorMessage.http).send(validationErrorMessage);
        }
        
        // Outros erros (conexão com DB, etc.)
        console.error("Erro fatal ao criar Expert:", error);
        
        const internalError = {
            http: 500,
            code: "InternalError",
            message: "Ocorreu um erro interno no servidor."
        };
        return res.status(internalError.http).send(internalError);
    }
}

exports.update = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Expert.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: req.body
    }, {
        new: true
    }, (error, expert) => {
        if (error) throw error;
        if (!expert) return res.status(ExpertMessages.error.e0.http).send(ExpertMessages.error.e0);

        let message = ExpertMessages.success.s1;
        message.body = expert;
        return res.status(message.http).send(message);

    });
}

exports.delete = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Expert.deleteOne({
        _id: req.params.id
    }, (error, result) => {
        if (error) throw error;
        if (result.deletedCount <= 0) return res.status(ExpertMessages.error.e0.http).send(ExpertMessages.error.e0);
        return res.status(ExpertMessages.success.s3.http).send(ExpertMessages.success.s3);

    });
}

/*exports.getOne = (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Expert.findOne({
        _id: req.params.id
    }).populate("comments.user", "nome").exec((error, expert) => {
        if (error) throw error;
        if (!expert) return res.status(ExpertMessages.error.e0.http).send(ExpertMessages.error.e0);
        let message = ExpertMessages.success.s2;
        message.body = expert;
        return res.status(message.http).send(message);
    });

}*/

exports.getOne = (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Expert.findOne({
        _id: req.params.id
    }, (error, expert) => {
        if (error) throw error;
        if (!expert) return res.status(ExpertMessages.error.e0.http).send(ExpertMessages.error.e0);
        let message = ExpertMessages.success.s2;
        message.body = expert;
        return res.status(message.http).send(message);
    });

}

exports.activate = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Expert.updateOne({
        _id: req.params.id
    }, {
        $set: {
            active: true
        }
    }, (error, result) => {
        if (error) throw error;

        if (result.n <= 0) return res.status(ExpertMessages.error.e0.http).send(ExpertMessages.error.e0);
        return res.status(ExpertMessages.success.s6.http).send(ExpertMessages.success.s6);

    });
}

exports.deactivate = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Expert.updateOne({
        _id: req.params.id
    }, {
        $set: {
            active: false
        }
    }, (error, result) => {
        if (error) throw error;

        if (result.n <= 0) return res.status(ExpertMessages.error.e0.http).send(ExpertMessages.error.e0);
        return res.status(ExpertMessages.success.s4.http).send(ExpertMessages.success.s4);

    });
}