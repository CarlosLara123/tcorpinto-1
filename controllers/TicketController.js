'use strict'

const Store = require('../models/Store');
const TicketSystem = require("../models/TicketSystem");
const TicketInmediates = require("../models/TicketInmediates");
const TicketPhoto = require("../models/TicketPhoto");
const TicketExternal = require('../models/TicketExternal');
const nodemailer = require('nodemailer');
const cloudinary = require('../cloudinary.config');

//Crea los tickets de traslado de sistema
async function storeTicketSystemTransfer(req, res) {
    let params = req.body;
    let Ticket = new TicketSystem();
    console.log(params)
    //Se genera en el ticket de la tranferencia
    Ticket.status = 'Pendiente';
    Ticket.store_created = params[0].store_created;
    Ticket.store_asigned = params[0].store_asigned;

    //insertamos los productos que se transferiran con el ticket
    params.map(data => {
        let producto = {
            upc: data.upc,
            alu: data.alu,
            size: data.size,
            bill: data.bill,
        }
        Ticket.product.push(producto);
    })

    await Ticket.save(async (err, storedTicket) => {
        if (err) return res.status(500).send({ message: 'Error al crear el ticket' });
        if (storedTicket) {
            let result_email = await email(
                params,
                'Nuevo Ticket De Traslado Sistema Informática',
                `<table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff" class="bg_color">
                    <tr>
                        <td align="center">
                            <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590">
                                <tr>
                                    <td align="center" class="section-img">
                                        <a href="" style=" border-style: none !important; display: block; border: 0 !important;"><img src="https://static.vecteezy.com/system/resources/previews/000/511/940/large_2x/currency-exchange-glyph-black-icon-vector.jpg" style="display: block; width: 190px;" width="190" border="0" alt="" /></a>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center" style="color: #343434; font-size: 20px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header">
                                        <div style="line-height: 35px">
                                            NUEVO TICKET TRASLADO EN SISTEMA
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <table border="0" width="40" align="center" cellpadding="0" cellspacing="0" bgcolor="eeeeee">
                                            <tr>
                                                <td height="2" style="font-size: 2px; line-height: 2px;">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                                </tr>

                                <tr>
                                    <td align="center">
                                        <table border="0" width="600" align="center" cellpadding="0" cellspacing="0" class="container590">
                                            <tr>
                                                <td align="center" style="font-size: 15px; font-family: "Work Sans", Calibri, sans-serif; line-height: 24px; color:black">

                                                    <div style="color:black">
                                                        Se ha creado un ticket de traslado de mercaderia unicamente en el sistema de la tienda <b>${params[0].store_created}</b>, 
                                                        por favor dar seguimiento al ticket dentro de la plataforma.
                                                    </div>
                                                    <p>listado de articulos solicitados:</p>
                                                    <table class="table" style="text-align: center" width="90%">
                                                        <thead align="center">
                                                            <tr>
                                                                <th scope="col" width: 20px>UPC</th>
                                                                <th scope="col" width: 20px>ALU</th>
                                                                <th scope="col" width: 20px>TALLA</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody align="center">
                                                        ${
                                                            params.map(x => {
                                                                return (
                                                                    `<tr>
                                                                        <td>${x.upc}</td>
                                                                        <td>${x.alu}</td>
                                                                        <td>${x.size}</td>
                                                                    </tr>`
                                                                )
                                                            })
                                                        }
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr class="hide">
                        <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td height="40" style="font-size: 40px; line-height: 40px;">&nbsp;</td>
                    </tr>
                </table>`
            );
            console.log(result_email)
            return res.status(200).send({ ticket: storedTicket, message: 'Ticket creado exitosamente!' });
        }
    });
}
//Crea los tickets de entragas inmediatas
async function storeTicketInmediates(req, res) {
    let params = req;
    let Inmediates = new TicketInmediates();
    //let result = await cloudinary.uploader.upload(req.files.image.path);
    console.log(params)
}
//Crea los tickets de retiros de fotografias
async function storeTicketPhotoRetreats(req, res) {
    let params = req.body;
    let Ticket = new TicketPhoto();

    //Se genera en el ticket de la tranferencia
    Ticket.status = 'Pendiente';
    Ticket.store_created = params[0].store_created;
    Ticket.store_asigned = "Pruebas Sistemas";
    Ticket.caurier = params[0].caurier;

    //insertamos los productos que se transferiran con el ticket
    params.map(data => {
        let producto = {
            upc: data.upc,
            alu: data.alu,
            size: data.size,
        }
        Ticket.product.push(producto);
    })
    //Se guarda el ticket
    await Ticket.save((err, storedTicket) => {
        if (err) return res.status(500).send({ message: 'Error al crear el ticket' });
        if (storedTicket) {
            email(
                params,
                'Retiro de Mercaderia para fotografía',
                `<table style="display:none!important;">
                <tr>
                    <td>
                        <div style="overflow:hidden;display:none;font-size:1px;color:#ffffff;line-height:1px;font-family:Arial;maxheight:0px;max-width:0px;opacity:0;">
                            Información De Envio Inmediato
                        </div>
                    </td>
                </tr>
            </table>
            <!-- pre-header end -->
            <!-- header -->
            <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff">
                <tr>
                    <td align="center">
                        <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590">
                            <tr>
                                <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <!-- end header -->
            <!-- big image section -->
            <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff" class="bg_color">
                <tr>
                    <td align="center">
                        <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590">
                            <tr>
                                <td align="center" class="section-img">
                                    <a href="" style=" border-style: none !important; display: block; border: 0 !important;"><img src="https://cdn.pixabay.com/photo/2016/10/08/18/34/camera-1724286_960_720.png" style="display: block; width: 190px;" width="190" border="0" alt="" /></a>
                                </td>
                            </tr>
                            <tr>
                                <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td align="center" style="color: #343434; font-size: 20px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header">
                                    <div style="line-height: 35px">
                                        NUEVO TICKET RETIRO FOTOGRAFÍA
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td align="center">
                                    <table border="0" width="40" align="center" cellpadding="0" cellspacing="0" bgcolor="eeeeee">
                                        <tr>
                                            <td height="2" style="font-size: 2px; line-height: 2px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td align="center">
                                    <table border="0" width="600" align="center" cellpadding="0" cellspacing="0" class="container590">
                                        <tr>
                                            <td align="center" style="font-size: 15px; font-family: "Work Sans", Calibri, sans-serif; line-height: 24px; color:black">
                                                <div style="color:black">
                                                <b>Se entrego a André Cifuentes la siguente mercadería para toma de fotos, lo esta retirando ${params[0].caurier}
                                                </b>
                                                <br>
                                                </b>
                                                <p>listado de articulos solicitados:</p>
                                             <table class="table">
                                             <thead align="center">
                                             <tr>
                                                 <th scope="col" width: 20px>UPC</th>
                                                 <th scope="col" width: 20px>ALU</th>
                                                 <th scope="col" width: 20px>TALLA</th>
                                             </tr>
                                         </thead>
                                         <tbody align="center">
                                            ${
                                            params.map(x => {
                                                return (
                                                    `<tr>
                                                         <td>${x.upc}</td>
                                                         <td>${x.alu}</td>
                                                         <td>${x.size}</td>
                                                     </tr>`
                                                    )
                                                })
                                            }
                                         </tbody>
                                        </table>
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr class="hide">
                    <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                </tr>
                <tr>
                    <td height="40" style="font-size: 40px; line-height: 40px;">&nbsp;</td>
                </tr>
            </table>
            <!-- end section -->`
            )
            return res.status(200).send({ ticket: storedTicket, message: 'Ticket creado exitosamente!' });
        }
    });
}
//Crea los tickets de retiros externos
async function storeTicketExternalRetreats(req, res) {
    let params = req.body;
    let Ticket = new TicketExternal();

    //Se genera en el ticket de la tranferencia
    Ticket.store_created = params[0].store_created;
    Ticket.name = params[0].person_retreats,
        Ticket.manager = params[0].person_authorizing,
        Ticket.inv_val = params[0].bill,
        Ticket.status = "Completado"
    //insertamos los productos que se transferiran con el ticket
    params.map(data => {
        let producto = {
            upc: data.upc,
            alu: data.alu,
            size: data.size,
        }
        Ticket.product.push(producto);
    })

    //Se guarda el ticket
    await Ticket.save((err, storedTicket) => {
        if (err) return res.status(500).send({ message: 'Error al crear el ticket' });
        if(storedTicket){
            email(
                params,
                'Nuevo Ticket De Retitos Externos',
                `<!-- pre-header -->
                <table style="display:none!important;">
                    <tr>
                        <td>
                            <div style="overflow:hidden;display:none;font-size:1px;color:#ffffff;line-height:1px;font-family:Arial;maxheight:0px;max-width:0px;opacity:0;">
                                Información de Ticket de la plataforma
                            </div>
                        </td>
                    </tr>
                </table>
                <!-- pre-header end -->
                <!-- header -->
                <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff">
            
                    <tr>
                        <td align="center">
                            <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590">
            
                                <tr>
                                    <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                                </tr>
            
                            </table>
                        </td>
                    </tr>
                </table>
                <!-- end header -->
            
                <!-- big image section -->
                <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff" class="bg_color">
            
                    <tr>
                        <td align="center">
                            <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590">
                                <tr>
            
                                    <td align="center" class="section-img">
                                        <a href="" style=" border-style: none !important; display: block; border: 0 !important;"><img src="https://s3.amazonaws.com/iconbros/icons/icon_pngs/000/000/701/original/receipt.png?1513421069" style="display: block; width: 190px;" width="190" border="0" alt="" /></a>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center" style="color: #343434; font-size: 20px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header">
            
            
                                        <div style="line-height: 35px">
            
                                            <span style="color: #5caad2;"></span>Solicitud de retiro de mercadería</span>
            
                                        </div>
                                    </td>
                                </tr>
            
                                <tr>
                                    <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td>
                                </tr>
            
                                <tr>
                                    <td align="center">
                                        <table border="0" width="40" align="center" cellpadding="0" cellspacing="0" bgcolor="eeeeee">
                                            <tr>
                                                <td height="2" style="font-size: 2px; line-height: 2px;">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
            
                                <tr>
                                    <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                                </tr>
            
                                <tr>
                                    <td align="center" style="color:black">
                                        <table border="0" width="400" align="center" cellpadding="0" cellspacing="0" class="container590">
                                            <tr>
                                                <td align="center" style="font-size: 15px; font-family: "Work Sans", Calibri, sans-serif; line-height: 24px;">
            
            
                                                    <div style="line-height: 24px">
                                                     ${params[0].person_retreats} acaba de solicitar un retiro de mercadería en la tienda ${params[0].store_created}, por favor dar seguimiento dentro de la plataforma. 
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
            
                            </table>
            
                        </td>
                    </tr>
            
                    <tr class="hide">
                        <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td height="40" style="font-size: 40px; line-height: 40px;">&nbsp;</td>
                    </tr>
            
                </table>
                <!-- end section -->`
            )
            return res.status(200).send({ ticket: storedTicket, message: 'Ticket creado exitosamente!' });
        }
    });
}
//Obtiene los tikets creados por el usuario que se trasladan a otra tienda
async function getSystemTransferCreate(req, res) {
    let ticketSystem = await TicketSystem.find({
        status: 'Pendiente',
        $or: [
            { store_created: req.body.store },
        ]
    }).sort({ timestamp: -1 });

    return res.status(200).json({
        ticketSystem
    });
}
//Obtiene los tikets asignados a la tienda del usuario
async function getSystemTransferAssigned(req, res) {
    let ticketSystem = await TicketSystem.find({
        status: 'Pendiente',
        $or: [
            { store_asigned: req.body.store }
        ]
    }).sort({ timestamp: -1 });

    return res.status(200).json({
        ticketSystem
    });
}
//Obtiene los tikets de retiros de fotografía
async function getPhotoRetreats(req, res) {
    let ticketPhotoRetrats = await TicketPhoto.find({
        status: 'Pendiente',
        $or: [
            { store_created: req.body.store },
        ]
    }).sort({ timestamp: -1 });

    return res.status(200).json({
        ticketPhotoRetrats
    });
}
//Obtiene los tikets de retiros externos
async function getExernalRetreats(req, res) {
    await TicketExternal.find({
        store_created: req.body.store,
        status: "Completado"
    }).exec((error, result) => {
        if (error) return res.status(500).send({ message: "Error en la busqueda" })
        return res.status(200).send({ result })
    });
}
//Inactiva los tikets de traslados de sistema
async function inactivateTicket(req, res) {
    let ticket_id = req.params.id;

    TicketSystem.findByIdAndUpdate(ticket_id, { status: 'Inactvio' }, async (err, inactive) => {
        if (err) return res.status(500).send({ message: "Error al eliminar ticket" });
        if (inactive) {
            console.log(inactive.store_created);
            let params = [inactive]
            await email(
                params,
                'Ticket Traslado De Sistema Cancelado',
                `<table style="display:none!important;">
                <tr>
                    <td>
                        <div style="overflow:hidden;display:none;font-size:1px;color:#ffffff;line-height:1px;font-family:Arial;maxheight:0px;max-width:0px;opacity:0;">
                            Información de Ticket de la plataforma
                        </div>
                    </td>
                </tr>
            </table>
            <!-- pre-header end -->
            <!-- header -->
            <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff">
        
                <tr>
                    <td align="center">
                        <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590">
        
                            <tr>
                                <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                            </tr>
        
                
        
                            <tr>
                                <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                            </tr>
        
                        </table>
                    </td>
                </tr>
            </table>
            <!-- end header -->
        
            <!-- big image section -->
            <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff" class="bg_color">
        
                <tr>
                    <td align="center">
                        <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590">
                            <tr>
        
                                <td align="center" class="section-img">
                                    <a href="" style=" border-style: none !important; display: block; border: 0 !important;"><img src="https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/close-circle-red-512.png" style="display: block; width: 190px;" width="190" border="0" alt="" /></a>
                                </td>
                            </tr>
                            <tr>
                                <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td align="center" style="color: #343434; font-size: 20px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header">
        
        
                                    <div style="line-height: 35px">
        
                                        TICKET TRASLADO DE SISTEMA CANCELADO
        
                                    </div>
                                </td>
                            </tr>
        
                            <tr>
                                <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td>
                            </tr>
        
                            <tr>
                                <td align="center">
                                    <table border="0" width="40" align="center" cellpadding="0" cellspacing="0" bgcolor="eeeeee">
                                        <tr>
                                            <td height="2" style="font-size: 2px; line-height: 2px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
        
                            <tr>
                                <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td align="center">
                                    <table border="0" width="600" align="center" cellpadding="0" cellspacing="0" class="container590">
                                        <tr>
                                            <td align="center" style="font-size: 15px; font-family: "Work Sans", Calibri, sans-serif; line-height: 24px; color:black">
                                                <div style="color:black">
                                                La tienda <b>${inactive.store_asigned}</b> ha cancelado el ticket de petición de traslado en sistema 
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr class="hide">
                    <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                </tr>
                <tr>
                    <td height="40" style="font-size: 40px; line-height: 40px;">&nbsp;</td>
                </tr>
        
            </table>
            <!-- end section -->`
            )
            return res.status(200).send({ message: 'Ticket eliminado!', ticekt: inactive })
        }
    })
}
//Inactiva los tikets de fotos retiradas
async function inactivatePhotoRetreats(req, res) {
    let ticket_id = req.params.id;

    TicketPhoto.findByIdAndUpdate(ticket_id, { status: 'Inactvio' }, (err, inactive) => {
        if (err) return res.status(500).send({ message: "Error al eliminar ticket" });
        if(inactive){
            email(
                [inactive],
                'Cancelar Retiro Fotografía',
                `<!-- pre-header -->
                <table style="display:none!important;">
                    <tr>
                        <td>
                            <div style="overflow:hidden;display:none;font-size:1px;color:#ffffff;line-height:1px;font-family:Arial;maxheight:0px;max-width:0px;opacity:0;">
                                Información de Ticket de la plataforma
                            </div>
                        </td>
                    </tr>
                </table>
                <!-- pre-header end -->
                <!-- header -->
                <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff">
            
                    <tr>
                        <td align="center">
                            <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590">
            
                                <tr>
                                    <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                                </tr>
            
                    
            
                                <tr>
                                    <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                                </tr>
            
                            </table>
                        </td>
                    </tr>
                </table>
                <!-- end header -->
            
                <!-- big image section -->
                <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff" class="bg_color">
            
                    <tr>
                        <td align="center">
                            <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590">
                                <tr>
            
                                    <td align="center" class="section-img">
                                        <a href="" style=" border-style: none !important; display: block; border: 0 !important;"><img src="https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/close-circle-red-512.png" style="display: block; width: 190px;" width="190" border="0" alt="" /></a>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center" style="color: #343434; font-size: 20px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header">
            
            
                                        <div style="line-height: 35px">
            
                                            TICKET PARA FOTOS CANCELADO
            
                                        </div>
                                    </td>
                                </tr>
            
                                <tr>
                                    <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td>
                                </tr>
            
                                <tr>
                                    <td align="center">
                                        <table border="0" width="40" align="center" cellpadding="0" cellspacing="0" bgcolor="eeeeee">
                                            <tr>
                                                <td height="2" style="font-size: 2px; line-height: 2px;">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
            
                                <tr>
                                    <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                                </tr>
            
                                <tr>
                                    <td align="center">
                                        <table border="0" width="600" align="center" cellpadding="0" cellspacing="0" class="container590">
                                            <tr>
                                                <td align="center" style="font-size: 15px; font-family: "Work Sans", Calibri, sans-serif; line-height: 24px; color:black">
            
            
                                                    <div style="color:black">
                                                    La tienda {{store}} ha cancelado el ticket de petición de Retiro de mercadería para fotos
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
            
                               
            
            
                            </table>
            
                        </td>
                    </tr>
            
                    <tr class="hide">
                        <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td height="40" style="font-size: 40px; line-height: 40px;">&nbsp;</td>
                    </tr>
            
                </table>
                <!-- end section -->`
            )
            return res.status(200).send({ message: 'Ticket eliminado!', ticekt: inactive })
        }
    })
}
//Inactiva los tikets de retiros externos
async function inactivateExternalRetreats(req, res) {
    let ticket_id = req.params.id;

    TicketExternal.findByIdAndUpdate(ticket_id, { status: 'Inactvio' }, (err, inactive) => {
        if (err) return res.status(500).send({ message: "Error al eliminar ticket" });
        if(inactive){
            return res.status(200).send({ message: 'Ticket eliminado!', ticekt: inactive })
        }
    })
}
//Pasar estado de ticket de pendiente a completado
async function completeTicket(req, res) {
    let ticket_id = req.params.id;

    TicketSystem.findByIdAndUpdate(ticket_id, { status: 'Completado' }, async (err, complete) => {
        if (err) return res.status(500).send({ message: "Error al completar ticket" });
        if (complete) {
            let params = [complete]
            await email(
                 params,
                'Ticket De Traslado sistema Completado',
                `<!-- pre-header -->
                <table style="display:none!important;">
                    <tr>
                        <td>
                            <div style="overflow:hidden;display:none;font-size:1px;color:#ffffff;line-height:1px;font-family:Arial;maxheight:0px;max-width:0px;opacity:0;">
                                Información de Ticket de la plataforma
                            </div>
                        </td>
                    </tr>
                </table>
                <!-- pre-header end -->
                <!-- header -->
                <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff">
                    <tr>
                        <td align="center">
                            <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590">
                                <tr>
                                    <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <!-- end header -->
                <!-- big image section -->
                <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff" class="bg_color">
                    <tr>
                        <td align="center">
                            <table border="0" align="center" width="590" cellpadding="0" cellspacing="0" class="container590">
                                <tr>
                                    <td align="center" class="section-img">
                                        <a href="" style=" border-style: none !important; display: block; border: 0 !important;"><img src="https://static.vecteezy.com/system/resources/previews/000/511/940/large_2x/currency-exchange-glyph-black-icon-vector.jpg" style="display: block; width: 190px;" width="190" border="0" alt="" /></a>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center" style="color: #343434; font-size: 20px; font-family: Quicksand, Calibri, sans-serif; font-weight:700;letter-spacing: 3px; line-height: 35px;" class="main-header">
                                        <div style="line-height: 35px">
                                            TICKET TRASLADO DE SISTEMA COMPLETADO
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <table border="0" width="40" align="center" cellpadding="0" cellspacing="0" bgcolor="eeeeee">
                                            <tr>
                                                <td height="2" style="font-size: 2px; line-height: 2px;">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="20" style="font-size: 20px; line-height: 20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <table border="0" width="600" align="center" cellpadding="0" cellspacing="0" class="container590">
                                            <tr>
                                                <td align="center" style="font-size: 15px; font-family: "Work Sans", Calibri, sans-serif; line-height: 24px; color:black">
                                                    <div style="color:black">
                                                        El traslado que solicitaste a la tienda <b>${complete.store_asigned}</b> por el sistema ya fue realizado verificarlo por favor.
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr class="hide">
                        <td height="25" style="font-size: 25px; line-height: 25px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td height="40" style="font-size: 40px; line-height: 40px;">&nbsp;</td>
                    </tr>
                </table>
                <!-- end section -->`
            )
            return res.status(200).send({ message: 'El ticket se a completado!', ticekt: complete })
        }
    })
}
//Pasar estado de ticket de pendiente a completado
function completePhotoRetreats(req, res) {
    let ticket_id = req.params.id;

    TicketPhoto.findByIdAndUpdate(ticket_id, { status: 'Completado' }, (err, complete) => {
        if (err) return res.status(500).send({ message: "Error al completar ticket" });
        return res.status(200).send({ message: 'El ticket se a completado!', ticekt: complete })
    })
}
//Obetener todas las tiendas
async function getStore(req, res) {
    let result = await Store.find();
    return res.json({ result })
}
//Crea un codigo random para los tickets
function randomNumber() {
    const possible = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let ramdomNum = 0;
    for (let i = 0; i < 6; i++) {
        ramdomNum += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return ramdomNum;
}
//Generar Email
async function email(data, titulo, template) {
    let randsend = randomNumber();
    let Moment = require("moment-timezone");
    let hoy = Moment().tz("America/Guatemala")._d;
    let dd = hoy.getDate();
    let mm = hoy.getMonth() + 1;
    let yyyy = hoy.getFullYear();
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.dreamhost.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "soporte@tickets.corpinto.com", // generated ethereal user
            pass: "m1$0n@lc0rp!nt0" // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'soporte@tickets.corpinto.com', // sender address
        to: "dlara2017229@gmail.com", // list of receivers
        subject:
            `${titulo} ${data[0].store_created} ${dd}/${mm}/${yyyy} - Ticket ${randsend}`,
        text: "", // plain text body
        html: template, // html body
    }, async function (err, json) {
        if(err) console.log(`ERROR EN EL ENVÍO: ${err}`);
        if(json) console.log(`CORREO SE ENVIADO EXITOSAMENTE: ${json}`);
    });
}

async function getTicketsInmediate(req,res){
    const dataStore = [];
    let result = await TicketInmediate.find({},{
    upc: 1,
    alu: 1,
    siz: 1,

    upc1: 1,
    alu1: 1,
    siz1: 1,

    upc2: 1,
    alu2: 1,
    siz2: 1,

    upc3: 1,
    alu3: 1,
    siz3: 1,

    upc4: 1,
    alu4: 1,
    siz4: 1,

    upc5: 1,
    alu5: 1,
    siz5: 1,

    upc6: 1,
    alu6: 1,
    siz6: 1,

    upc7: 1,
    alu7: 1,
    siz7: 1,

    upc8: 1,
    alu8: 1,
    siz8: 1,

    upc9: 1,
    alu9: 1,
    siz9: 1,

    upc10: 1,
    alu10: 1,
    siz10: 1,

    upc11: 1,
    alu11: 1,
    siz11: 1,

    upc12: 1,
    alu12: 1,
    siz12: 1,

    upc13: 1,
    alu13: 1,
    siz13: 1,

    upc14: 1,
    alu14: 1,
    siz14: 1,

    upc15: 1,
    alu15: 1,
    siz15: 1,

    upc16: 1,
    alu16: 1,
    siz16: 1,

    upc17: 1,
    alu17: 1,
    siz17: 1,

    upc18: 1,
    alu18: 1,
    siz18: 1,

    upc19: 1,
    alu19: 1,
    siz19: 1,

    upc20: 1,
    alu20: 1,
    siz20: 1,

    upc21: 1,
    alu21: 1,
    siz21: 1,

    upc22: 1,
    alu22: 1,
    siz22: 1,

    upc23: 1,
    alu23: 1,
    siz23: 1,

    upc24: 1,
    alu24: 1,
    siz24: 1,

    upc25: 1,
    alu25: 1,
    siz25: 1,

    upc26: 1,
    alu26: 1,
    siz26: 1,

    upc27: 1,
    alu27: 1,
    siz27: 1,

    upc28: 1,
    alu28: 1,
    siz28: 1,

    upc29: 1,
    alu29: 1,
    siz29: 1,

    upc30: 1,
    alu30: 1,
    siz30: 1,

    upc31: 1,
    alu31: 1,
    siz31: 1,

    upc32: 1,
    alu32: 1,
    siz32: 1,

    upc33: 1,
    alu33: 1,
    siz33: 1,

    upc34: 1,
    alu34: 1,
    siz34: 1,

    upc35: 1,
    alu35: 1,
    siz35: 1,

    upc36: 1,
    alu36: 1,
    siz36: 1,

    upc37: 1,
    alu37: 1,
    siz37: 1,

    upc38: 1,
    alu38: 1,
    siz38: 1,

    upc39: 1,
    alu39: 1,
    siz39: 1,

    upc40: 1,
    alu40: 1,
    siz40: 1,

    upc41: 1,
    alu41: 1,
    siz41: 1,

    upc42: 1,
    alu42: 1,
    siz42: 1,

    upc43: 1,
    alu43: 1,
    siz43: 1,

    upc44: 1,
    alu44: 1,
    siz44: 1,

    upc45: 1,
    alu45: 1,
    siz45: 1,
    
    upc46: 1,
    alu46: 1,
    siz46: 1,

    upc47: 1,
    alu47: 1,
    siz47: 1,

    upc48: 1,
    alu48: 1,
    siz48: 1,

    upc49: 1,
    alu49: 1,
    siz49: 1,

    upc50: 1,
    alu50: 1,
    siz50: 1,
    fact: 1,
    fact_img:1,
    desc:1,
    store_asigned:1,
    status: 1,
    store_created: 1,
    email_asigned: 1,
    timestamp:1,
    timestampend:1 
    }).sort( { timestamp: -1 } );

    result.map((res) =>{
        let fecha = Moment(res.timestamp).format('YYYY-MM-DDT08:00:00.80Z')
        dataStore.push({
                        "fechaCreacion": fecha,
                        "Dia":Moment(fecha).format('DD'),
                        "Mes":Moment(fecha).format('MM'),
                        "Año":Moment(fecha).format('YYYY'),
                        "tiendaCreacion": res.store_created,
                        "tiendaAsignacion": res.store_asigned,
                        "estado":res.status,
                        "destino": res.desc,
                        "upc": res.upc,
                        "alu": res.alu,
                        "siz": res.siz,
                        
                        "upc1": res.upc1,
                        "alu1": res.alu1,
                        "siz1": res.siz1,

                        "upc2": res.upc2,
                        "alu2": res.alu2,
                        "siz2": res.siz2,

                        "upc3": res.upc3,
                        "alu3": res.alu3,
                        "siz3": res.siz3,

                        "upc4": res.upc4,
                        "alu4": res.alu4,
                        "siz4": res.siz4,

                        "upc4": res.upc4,
                        "alu4": res.alu4,
                        "siz4": res.siz4,

                        "upc4": res.upc4,
                        "alu4": res.alu4,
                        "siz4": res.siz4,

                        "upc5": res.upc5,
                        "alu5": res.alu5,
                        "siz5": res.siz5,

                        "upc6": res.upc6,
                        "alu6": res.alu6,
                        "siz6": res.siz6,

                        "upc7": res.upc7,
                        "alu7": res.alu7,
                        "siz7": res.siz7,

                        "upc8": res.upc8,
                        "alu8": res.alu8,
                        "siz8": res.siz8,

                        "upc9": res.upc9,
                        "alu9": res.alu9,
                        "siz9": res.siz9,

                        "upc10": res.upc10,
                        "alu10": res.alu10,
                        "siz10": res.siz10,

                })
    })
    
    return res.json({ dataStore })
}

module.exports = {
    storeTicketSystemTransfer,
    storeTicketInmediates,
    storeTicketPhotoRetreats,
    storeTicketExternalRetreats,
    getSystemTransferCreate,
    getSystemTransferAssigned,
    getPhotoRetreats,
    getExernalRetreats,
    inactivateTicket,
    inactivatePhotoRetreats,
    inactivateExternalRetreats,
    completeTicket,
    completePhotoRetreats,
    getTicketsInmediate,
    getStore,
}