using Microsoft.AspNetCore.Authorization;

namespace Server.Controllers;

[Authorize]
public class LlmController
{
    private static readonly string LLMApi = "http://kraguj.pmf.kg.ac.rs:12325/api";
}