import { NextRequest, NextResponse } from "next/server";
import Answer from "@/models/answer";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, question } = body;
    if (!name || !email || !Array.isArray(question) || question.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    let totalScore = 0;

    // Extract numberOfYears from the extraField
    const decisionTreeObj = question.find(
      (item) => item.extraField === "NumberOfYears"
    );

    // Calculate total score
    const questions = question.map((q) => {
      const score = q.score || 0;
      totalScore += score;
      return {
        questionId: q.questionId,
        questionText: q.questionText,
        answer: q.answer,
        score,
        extraField: q.extraField || "",
      };
    });

    // Determine risk category and investment recommendation dynamically
    let riskCategory = "";
    let investmentRecommendation: Record<string, number> = {};
    let topComment = "";
    let bottomComment = "";
    let middleComment = "";

    const scoreRule = decisionTreeObj?.answer.totalScore.find(
      (rule: any) => totalScore >= rule.min && totalScore <= rule.max
    );

    if (scoreRule) {
      riskCategory = scoreRule.riskCategory;
      investmentRecommendation = scoreRule.investmentRecommendation;
      //add
      topComment = scoreRule.topComment;
      bottomComment = scoreRule.bottomComment;
      middleComment = scoreRule.middleComment;
    }
    // Prepare the document to save
    const newAnswer = new Answer({
      name,
      email,
      questionId: questions.map((q) => q.questionId),
      questionText: questions.map((q) => q.questionText),
      answer: questions.map((q) => q.answer),
      score: questions.map((q) => q.score),
      extraField: questions[0]?.extraField || "",
      totalScore,
      numberOfYears: decisionTreeObj?.answer?.label,
      riskCategory,
      investmentRecommendation,
      topComment,
      middleComment,
      bottomComment,
    });

    const savedAnswer = await newAnswer.save();

    return NextResponse.json(
      {
        success: true,
        message: "Answer document created successfully.",
        data: {
          _id: savedAnswer._id,
          name: savedAnswer.name,
          email: savedAnswer.email,
          questions,
          totalScore,
          numberOfYears: decisionTreeObj?.answer?.label,
          riskCategory,
          investmentRecommendation,
          topComment,
          middleComment,
          bottomComment,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error saving answer:", error.message);
    return NextResponse.json(
      { success: false, error: "Failed to create answer." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {

  try {
    const { searchParams } = new URL(req.url);
    const answerId = searchParams.get("answerId");

    if (answerId) {
      // Find the answer document by its ID
      const answer = await Answer.findById(answerId);

      if (!answer) {
        return NextResponse.json(
          { success: false, error: "Answer not found." },
          { status: 404 }
        );
      }

      // Map the questions to the desired format
      const questions = answer.questionId.map((id, index) => ({
        questionId: id,
        questionText: answer.questionText[index],
        answer: answer.answer[index],
        score: answer.score[index],
        extraField: answer.extraField || "",
      }));
      const responseData = {
        _id: answer._id,
        name: answer.name,
        email: answer.email,
        questions: questions,
        totalScore: answer.totalScore,
        numberOfYears: answer.numberOfYears || "",
        riskCategory: answer.riskCategory,
        investmentRecommendation: answer.investmentRecommendation,

      };

      return NextResponse.json({
        success: true,
        message: "Answer document fetched successfully.",
        data: responseData,
      });
    }

    const answers = await Answer.find().sort({ createdAt: -1 });

    // Format all answers for consistency
    const formattedAnswers = answers.map((answer) => {
      const questions = answer.questionId.map((id, index) => ({
        questionId: id,
        questionText: answer.questionText[index],
        answer: answer.answer[index],
        score: answer.score[index],
        extraField: answer.extraField || "",
      }));

      return {
        _id: answer._id,
        name: answer.name,
        email: answer.email,
        questions: questions,
        totalScore: answer.totalScore,
        numberOfYears: answer.numberOfYears || "",
        riskCategory: answer.riskCategory,
        investmentRecommendation: answer.investmentRecommendation,

      };
    });

    return NextResponse.json({
      success: true,
      message: "Answers fetched successfully.",
      data: formattedAnswers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
