import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class TestApplication {
    public static void main(String[] args) {
        SpringApplication.run(TestApplication.class, args);
    }
}

@RestController
@RequestMapping("/test")
class TestController {
    @GetMapping
    public String testEndpoint() {
        return "It works";
    }
}

