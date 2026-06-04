<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    // Verificar si existe la sesión del usuario
    HttpSession misession = request.getSession(false);
    if (misession == null || misession.getAttribute("usuarioLogueado") == null) {
        // Si no está logueado, lo mandamos de patitas a la calle (al login)
        response.sendRedirect("login.jsp");
        return; 
    }
    String usuario = (String) misession.getAttribute("usuarioLogueado");
%>
<!DOCTYPE html>
<html>
<head>
    <title>Panel Principal</title>
</head>
<body>
    <h1>Bienvenido, <%= usuario %>!</h1>
    <p>Este es un contenido protegido.</p>
    <a href="logout">Cerrar Sesión</a>
</body>
</html>
