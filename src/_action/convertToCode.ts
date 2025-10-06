"use server";

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function convertToCode(formData: FormData) {
  try {
    const image = formData.get("image") as File;

    if (!image) {
      return {
        success: false,
        error: "이미지가 없습니다.",
      };
    }

    // File을 Base64로 변환
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // 이미지 타입 감지
    const imageType = image.type.split("/")[1] as
      | "jpeg"
      | "png"
      | "gif"
      | "webp";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: `image/${imageType}`,
                data: base64Image,
              },
            },
            {
              type: "text",
              text: `버튼 컴포넌트를 만들어줘.`,
            },
            {
              type: "text",
              text: `이 UI를 React + Tailwind CSS를 사용해서 컴포넌트로 만들어줘. 
              
요구사항:
- TypeScript를 사용할 것
- Tailwind CSS 유틸리티 클래스만 사용할 것
- material-ui가 사용하는 형식의 props를 사용할것
- 반응형 디자인을 고려할 것
- 접근성을 고려할 것
- 완전히 작동하는 코드를 제공할 것
- 컴포넌트 이름은 카멜 케이스로 할 것
- Next.js 15 버전을 사용할 것
- Image 컴포넌트는 next/image를 사용할 것

코드만 반환해줘.`,
            },
          ],
        },
      ],
    });

    console.log(JSON.stringify(response.content[0], null, 2));

    return {
      success: true,
      content:
        response.content[0].type === "text" ? response.content[0].text : "",
    };
  } catch (error) {
    console.error("Claude API Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "오류가 발생했습니다.",
    };
  }
}
