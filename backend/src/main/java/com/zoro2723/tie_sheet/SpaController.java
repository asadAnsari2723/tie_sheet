package com.zoro2723.tie_sheet;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    @RequestMapping(value = {"/{_:^(?!api|static).*$}", "/**/{_:^(?!api|static).*$}"})
    public String redirect() {
        return "forward:/index.html";
    }
}
