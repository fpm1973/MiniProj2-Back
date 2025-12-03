const Sponsor = require('../models/sponsor.model');
const {
    validationResult
} = require('express-validator');
const SponsorMessages = require("../messages/sponsor.messages");

exports.get = async (req, res) => {
    try {
       
        const sponsors = await Sponsor.find(req.query).exec(); 

        let message = SponsorMessages.success.s2;

        if (sponsors.length === 0) {
            message = SponsorMessages.success.s5; 
        }

        message.body = sponsors;
        return res.status(message.http).send(message);

    } catch (error) {
       
        console.error("Erro ao buscar sponsors:", error);
        
        // Define uma mensagem de erro 500
        const errorMessage = {
            http: 500,
            code: "InternalError",
            message: "Ocorreu um erro interno no servidor ao buscar os sponsors."
        };
        
        return res.status(errorMessage.http).send(errorMessage);
    }
};


exports.create = async (req, res) => {
    // 1. Validação Express-Validator (OK)
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    try {
        // Cria e salva o novo Sponsor de forma assíncrona
        const newSponsor = new Sponsor({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            url: req.body.url,
            nivel: req.body.nivel,
            categoria: req.body.categoria,
            informacoes: req.body.informacoes,
            urlfoto: req.body.urlfoto
        });
        
        const sponsor = await newSponsor.save(); // Awaits a promessa de save

        // 2. Lógica de Sucesso (201 Created)
        let message = SponsorMessages.success.s0;
        message.body = sponsor;
        return res.header("location", "/sponsors/" + sponsor._id).status(message.http).send(message);
        
    } catch (error) {
        // 3. Tratamento Robusto de Erros (Mongoose Validation/Database Errors)
        
        // Verifica se é um erro de validação Mongoose (ex: Enum inválido)
        if (error.name === 'ValidationError') {
            // Retorna 400 Bad Request para o cliente
            const validationErrorMessage = {
                http: 400,
                code: "ValidationError",
                message: "Falha na validação dos dados de Sponsor. Verifique os campos.",
                details: error.message // Opcional: Para debugar no cliente
            };
            return res.status(validationErrorMessage.http).send(validationErrorMessage);
        }
        
        // Outros erros (conexão com DB, etc.)
        console.error("Erro fatal ao criar Sponsor:", error);
        
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

    Sponsor.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: req.body
    }, {
        new: true
    }, (error, sponsor) => {
        if (error) throw error;
        if (!sponsor) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);

        let message = SponsorMessages.success.s1;
        message.body = sponsor;
        return res.status(message.http).send(message);

    });
}

exports.delete = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.deleteOne({
        _id: req.params.id
    }, (error, result) => {
        if (error) throw error;
        if (result.deletedCount <= 0) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
        return res.status(SponsorMessages.success.s3.http).send(SponsorMessages.success.s3);

    });
}

exports.getOne = (req, res) => {

    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.findOne({
        _id: req.params.id
    }, (error, sponsor) => {
        if (error) throw error;
        if (!sponsor) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
        let message = SponsorMessages.success.s2;
        message.body = sponsor;
        return res.status(message.http).send(message);
    });

}


exports.activate = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.updateOne({
        _id: req.params.id
    }, {
        $set: {
            active: true
        }
    }, (error, result) => {
        if (error) throw error;

        if (result.n <= 0) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
        return res.status(SponsorMessages.success.s6.http).send(SponsorMessages.success.s6);

    });
}

exports.deactivate = (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) return res.status(406).send(errors);

    Sponsor.updateOne({
        _id: req.params.id
    }, {
        $set: {
            active: false
        }
    }, (error, result) => {
        if (error) throw error;

        if (result.n <= 0) return res.status(SponsorMessages.error.e0.http).send(SponsorMessages.error.e0);
        return res.status(SponsorMessages.success.s4.http).send(SponsorMessages.success.s4);

    });
}