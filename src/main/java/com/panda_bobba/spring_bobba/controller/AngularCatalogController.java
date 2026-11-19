package com.panda_bobba.spring_bobba.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.view.RedirectView;

@Controller
public class AngularCatalogController {
    @GetMapping("/gestion-catalogo")
    public String entrada() {
        return "redirect:/gestion-catalogo/";
    }

    @GetMapping({
        "/gestion-catalogo/",
        "/gestion-catalogo/productos",
        "/gestion-catalogo/productos/nuevo",
        "/gestion-catalogo/productos/{id:[0-9]+}",
        "/gestion-catalogo/productos/{id:[0-9]+}/editar",
        "/gestion-catalogo/sin-permiso"
    })
    public String catalogo() {
        return "forward:/gestion-catalogo/index.html";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/gestion-catalogo/acceso")
    public RedirectView accesoAngular() {
        var vista = new RedirectView("/login", true);
        vista.setPropagateQueryParams(true);
        return vista;
    }

    @GetMapping({"/panel", "/gestion", "/admin/productos", "/admin/productos/"})
    public String panelAnterior() {
        return "redirect:/gestion-catalogo/productos";
    }

    @GetMapping("/admin/productos/nuevo")
    public String nuevoAnterior() {
        return "redirect:/gestion-catalogo/productos/nuevo";
    }

    @GetMapping("/admin/productos/{id:[0-9]+}")
    public String detalleAnterior(@PathVariable String id) {
        return "redirect:/gestion-catalogo/productos/" + id;
    }

    @GetMapping({"/admin/productos/editar/{id:[0-9]+}", "/admin/productos/{id:[0-9]+}/editar"})
    public String edicionAnterior(@PathVariable String id) {
        return "redirect:/gestion-catalogo/productos/" + id + "/editar";
    }

    @GetMapping("/access-denied")
    public String accesoDenegadoAnterior() {
        return "redirect:/gestion-catalogo/sin-permiso";
    }
}
