package com.zoro2723.tie_sheet;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

@Component
public class StaticContentFilter implements Filter {

    private List<String> fileExtensions = Arrays.asList(
            "html", "js", "json", "css", "png", "svg", "eot", "ttf", "woff",
            "appcache", "jpg", "jpeg", "gif", "ico"
    );

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String path = httpRequest.getServletPath();

        boolean isApi = path.startsWith("/api");
        boolean isResourceFile = !isApi && fileExtensions.stream().anyMatch(path::contains);

        if (isApi) {
            chain.doFilter(request, response);
            return;
        }

        if (isResourceFile) {
            resourceToResponse("static" + path, httpResponse);
        } else {
            resourceToResponse("static/index.html", httpResponse);
        }
    }

    private void resourceToResponse(String resourcePath, HttpServletResponse response) throws IOException {
        InputStream inputStream = Thread.currentThread()
                .getContextClassLoader()
                .getResourceAsStream(resourcePath);

        if (inputStream == null) {
            response.sendError(HttpStatus.NOT_FOUND.value(), HttpStatus.NOT_FOUND.getReasonPhrase());
            return;
        }

        if (resourcePath.endsWith(".html")) {
            response.setContentType("text/html");
        } else if (resourcePath.endsWith(".css")) {
            response.setContentType("text/css");
        } else if (resourcePath.endsWith(".js")) {
            response.setContentType("application/javascript");
        }
        // add other content types as needed

        inputStream.transferTo(response.getOutputStream());
    }
}
